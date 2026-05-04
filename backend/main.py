from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse
from fastapi.responses import FileResponse
import os

# Importações da nossa arquitetura SOLID
from app.llm.base import Message
from app.llm.gemini import GeminiClient
from app.agent import NexusDiscoveryAgent
from app.services.report_gen import ReportGenerator

app = FastAPI(title="Nexus Discovery API")

# 1. Configuração de CORS (Obrigatório para o Lovable conseguir conversar com o back-end)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, podes colocar a URL do Lovable aqui
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Inicialização dos Serviços (Injeção de Dependência)
# LIGANDO DIRETO: Sem try/except para o Python nos mostrar o verdadeiro erro!
llm_client = GeminiClient()
agent = NexusDiscoveryAgent(llm_client=llm_client)
report_generator = ReportGenerator()


# 3. Modelos de Entrada (Pydantic)
class ChatRequest(BaseModel):
    user_message: str
    history: list[Message] = []

class ReportRequest(BaseModel):
    history: list[Message]
    analysis: str
    client_name: str = "Prospect"

# 4. Endpoints
@app.get("/")
async def root():
    return {"message": "Nexus Discovery API está rodando! Acesse /docs para testar."}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Recebe a mensagem do usuário e o histórico.
    O Agent cuida do RAG, do System Prompt e de chamar o LLM.
    """
    result = agent.execute_step(
        user_input=request.user_message,
        chat_history=request.history
    )
    
    return {
        "response": result["agent_response"],
        "internal_analysis": result["internal_analysis"],
        "phase_suggestion": result["phase_suggestion"]
    }

@app.post("/generate-report")
async def generate_report_endpoint(request: ReportRequest):
    # Alterado de generate_markdown para generate_pdf
    filename = report_generator.generate_pdf(
        chat_history=request.history,
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

@app.post("/generate-report")
async def generate_report_endpoint(request: ReportRequest):
    # Mudança aqui para generate_pdf
    filename = report_generator.generate_pdf(
        chat_history=request.history,
        analysis=request.analysis,
        client_name=request.client_name
    )
    
    return {
        "message": "PDF gerado com sucesso",
        "filename": filename # Retorne o filename para o front usar no próximo passo
    }