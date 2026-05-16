from fastapi import FastAPI, middleware, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse
import pypdf
import os

# Importações da nossa arquitetura SOLID
from app.llm.base import Message
from app.llm.gemini import GeminiClient
from app.agent import NexusDiscoveryAgent
from app.services.report_gen import ReportGenerator

app = FastAPI(title="Nexus Discovery API")

# Dicionário global para guardar a memória das conversas (O Cérebro)
sessions = {}

# 1. Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Inicialização dos Serviços
llm_client = GeminiClient()
agent = NexusDiscoveryAgent(llm_client=llm_client)
report_generator = ReportGenerator()


# 3. Modelos de Entrada (Pydantic)
class ChatRequest(BaseModel):
    user_message: str
    session_id: str = "default" # Agora passamos um ID em vez de todo o histórico

class ReportRequest(BaseModel):
    session_id: str = "default" # Usa o mesmo ID para buscar a memória
    analysis: str
    client_name: str = "Prospect"

# 4. Endpoints
@app.get("/")
async def root():
    return {"message": "Nexus Discovery API está rodando! Acesse /docs para testar."}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Recebe a mensagem do usuário e o ID da sessão.
    O próprio servidor busca o histórico, atualiza com a nova conversa e chama o Agente.
    """
    session_id = request.session_id

    # Passo A.1: Se a sessão não existe, cria uma memória em branco para o usuário
    if session_id not in sessions:
        sessions[session_id] = []

    # Passo A.2: Pega o histórico atual guardado no back-end
    historico_atual = sessions[session_id]

    # Passo A.3: O Agent cuida do RAG usando o histórico que estava na memória
    result = agent.execute_step(
        user_input=request.user_message,
        chat_history=historico_atual
    )
    
    # Passo A.4: ATUALIZA A MEMÓRIA! Salva a pergunta do usuário e a resposta da IA
    sessions[session_id].append(Message(role="user", content=request.user_message))
    sessions[session_id].append(Message(role="assistant", content=result["agent_response"]))
    
    return {
        "response": result["agent_response"], # Seu front-end só precisa exibir isso!
        "internal_analysis": result["internal_analysis"],
        "phase_suggestion": result["phase_suggestion"]
    }

@app.post("/generate-report")
async def generate_report_endpoint(request: ReportRequest):
    """
    Gera o PDF buscando as informações que já estavam salvas na sessão.
    """
    # Pega o histórico direto da memória do servidor para montar o relatório
    historico_atual = sessions.get(request.session_id, [])

    filename = report_generator.generate_pdf(
        chat_history=historico_atual,
        analysis=request.analysis,
        client_name=request.client_name
    )
    
    return {
        "message": "PDF gerado com sucesso",
        "filename": filename 
    }

@app.get("/health")
async def health_check():
    """Endpoint simples para o Lovable saber se o servidor está online."""
    return {"status": "online", "service": "Nexus Discovery API"}
@app.post("/upload-ata/")
async def upload_ata(file: UploadFile = File(...), session_id: str = "default"):
    """
    Recebe um arquivo PDF (Ata de reunião ou documento), extrai o texto
    e injeta direto no histórico da sessão do usuário como contexto.
    """
    try:
        # 1. Ler os bytes do arquivo enviado pelo front-end
        pdf_bytes = await file.read()
        
        # 2. Usar a biblioteca pypdf para abrir o arquivo em memória
        from io import BytesIO
        pdf_file = BytesIO(pdf_bytes)
        reader = pypdf.PdfReader(pdf_file)
        
        # 3. Percorrer as páginas e extrair todo o texto
        texto_extraido = ""
        for page in reader.pages:
            texto_extraido += page.extract_text() + "\n"
            
        # 4. Verificar se a sessão existe na nossa memória global
        if session_id not in sessions:
            sessions[session_id] = []
            
        # 5. Criar a mensagem usando a classe Message que seu projeto usa (SOLID)
        contexto = f"INFORMAÇÃO ADICIONAL (Ata/Documento anexado pelo usuário):\n{texto_extraido}"
        
        # Injeta na memória como uma mensagem do sistema para a IA ler antes de responder
        sessions[session_id].append(Message(role="system", content=contexto))
        
        return {
            "status": "sucesso",
            "message": f"Documento '{file.filename}' lido e anexado à sessão '{session_id}'!",
            "caracteres_extraidos": len(texto_extraido)
        }
        
    except Exception as e:
        return {"status": "erro", "message": f"Falha ao processar o PDF: {str(e)}"}