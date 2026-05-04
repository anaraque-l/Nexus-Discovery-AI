import os
import uuid
from dotenv import load_dotenv 
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings # <-- BIBLIOTECA NOVA
from langchain_chroma import Chroma

# Carrega as variáveis do arquivo .env
load_dotenv()

class DiscoveryRAG:
    def __init__(self, pdf_directory: str = None, persist_directory: str = None):
        
        # Pega o caminho absoluto da pasta onde ESTE arquivo (rag_service.py) está
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Junta o caminho da pasta atual com "conhecimento" e "chroma_db"
        self.pdf_directory = pdf_directory or os.path.join(base_dir, "conhecimento")
        self.persist_directory = persist_directory or os.path.join(base_dir, "chroma_db")
        
        # --- MANTENHA O RESTO DO SEU CÓDIGO IGUAL ---
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        if os.path.exists(self.persist_directory):
            print("Carregando banco de dados vetorial existente...")
            self.vector_store = Chroma(
                persist_directory=self.persist_directory, 
                embedding_function=self.embeddings
            )
        else:
            print("Banco não encontrado. Processando PDFs...")
            self.vector_store = self._build_knowledge_base()

    def _build_knowledge_base(self):
        documents = []
        
        if not os.path.exists(self.pdf_directory):
            os.makedirs(self.pdf_directory)
            print(f"Pasta '{self.pdf_directory}' criada. Adicione arquivos nela.")
            return None

        # Coleta os PDFs
        pdf_files = [f for f in os.listdir(self.pdf_directory) if f.endswith(".pdf")]
        
        if not pdf_files:
            print("⚠️ Nenhum arquivo PDF encontrado.")
            return None

        for filename in pdf_files:
            filepath = os.path.join(self.pdf_directory, filename)
            print(f"Lendo: {filename}")
            loader = PDFPlumberLoader(filepath)
            documents.extend(loader.load())

        if not documents:
            return None

        # Divide o texto
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
        chunks = text_splitter.split_documents(documents)

        print(f"Gerando vetores para {len(chunks)} blocos em velocidade MÁXIMA (Local)...")

        try:
            # Geramos os IDs únicos para não dar o erro de index do Chroma
            ids = [str(uuid.uuid4()) for _ in range(len(chunks))]
            
            # Criamos o banco tudo de uma vez, sem time.sleep!
            vector_store = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=self.persist_directory,
                ids=ids
            )
            
            print("✅ Banco de dados vetorial criado com sucesso!")
            return vector_store
            
        except Exception as e:
            print(f"Erro ao criar o banco: {e}")
            return None

    def search(self, query: str, top_k: int = 3):
        if not self.vector_store:
            return []
            
        results = self.vector_store.similarity_search(query, k=top_k)
        formatted_results = []
        for doc in results:
            formatted_results.append({
                "content": doc.page_content,
                "source": doc.metadata.get("source", "Desconhecido"),
                "page": doc.metadata.get("page", 0)
            })
        return formatted_results

# TESTE MANUAL FORÇADO
if __name__ == "__main__":
    print("Iniciando teste de busca...")
    try:
        rag = DiscoveryRAG()
        query_teste = "Qual a stack recomendada?"
        respostas = rag.search(query_teste)
        
        print(f"\n--- BUSCA REALIZADA: {len(respostas)} resultados encontrados ---")
        for r in respostas:
            print(f"\nFONTE: {r['source']}")
            print(f"CONTEÚDO: {r['content'][:150]}...")
            
    except Exception as e:
        print(f"ERRO DURANTE O TESTE: {e}")