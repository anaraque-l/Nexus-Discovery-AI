import google.generativeai as genai
from app.llm.base import LLMClient, Message
from app.core.config import settings

class GeminiClient(LLMClient):
    def __init__(self):
        # Configura a API key a partir do ficheiro config
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY não encontrada no ambiente ou .env")
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Inicializa o modelo
        self.model = genai.GenerativeModel(
            model_name=settings.MODEL_NAME,
            generation_config={
                "temperature": settings.TEMPERATURE,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
            }
        )

    def generate(self, messages: list[Message]) -> str:
        """
        Converte a nossa lista de mensagens (dataclass) para o formato do Gemini
        e gera a resposta.
        """
        
        # Convertemos o histórico para o formato que a biblioteca espera:
        history = []
        
        # A última mensagem do utilizador deve ser passada separadamente ou como a última do histórico
        for msg in messages[:-1]:
            role = "user" if msg.role == "user" else "model"
            # O System Prompt no Gemini é passado na configuração ou como primeira mensagem de 'user' 
            # dependendo da versão, mas aqui vamos tratar como histórico para simplificar:
            history.append({"role": role, "parts": [msg.content]})

        # Iniciamos o chat com o histórico acumulado
        chat_session = self.model.start_chat(history=history)
        
        # Enviamos a última mensagem (o input atual do utilizador)
        last_message = messages[-1].content
        response = chat_session.send_message(last_message)
        
        return response.text