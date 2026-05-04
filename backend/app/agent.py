import os
from app.llm.base import LLMClient, Message
from app.core.config import settings
from app.core.prompts import SYSTEM_PROMPT
from app.services.rag_service import DiscoveryRAG

class NexusDiscoveryAgent:
    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client
        # Inicializamos o seu banco vetorial aqui!
        self.rag = DiscoveryRAG()
        self.system_prompt = SYSTEM_PROMPT

    def _get_context(self, user_input: str) -> str:
        """
        Busca os trechos mais relevantes nos PDFs usando o RAG
        e transforma isso em texto para o Gemini ler.
        """
        # Busca no banco de vetores que você acabou de criar
        results = self.rag.search(user_input, top_k=3)
        
        if not results:
            return ""

        context_str = "\n### CONTEXTO INTERNO EXTRAÍDO DOS PDFS (Use como verdade absoluta): ###\n"
        for item in results:
            # Usamos 'source' e 'content' que definimos no rag_service.py
            context_str += f"- Fonte: {item['source']}\n  Trecho: {item['content']}\n\n"
        
        return context_str

    def _determine_next_step(self, history: list[Message]) -> str:
        """Lógica de intermediação baseada em palavras-chave"""
        full_text = " ".join([m.content for m in history]).lower()
        data_keywords = ['data', 'ia', 'ai', 'dashboard', 'predição', 'análise', 'banco', 'pipeline']
        
        count_data = sum(1 for word in data_keywords if word in full_text)
        
        if count_data > 1:
            return f"\n[SUGESTÃO INTERNA: Este projeto tem perfil para a esteira de {settings.NEXT_STEPS['DATA_IA']['focus']}]"
        return f"\n[SUGESTÃO INTERNA: Este projeto tem perfil para a esteira de {settings.NEXT_STEPS['SOFTWARE_DEV']['focus']}]"

    def execute_step(self, user_input: str, chat_history: list[Message] = None) -> dict:
        if chat_history is None:
            chat_history = []

        # 1. Recupera o contexto do RAG
        context = self._get_context(user_input)
        
        # 2. O TRUQUE: Envelopamos o System Prompt, o Contexto e a Pergunta juntos!
        prompt_turbinado = f"{self.system_prompt}\n\n{context}\n\n---\nPERGUNTA DO USUÁRIO:\n{user_input}"
        
        # Copiamos o histórico e adicionamos nossa mensagem turbinada com a role "user"
        messages = chat_history.copy()
        messages.append(Message(role="user", content=prompt_turbinado))
        
        # 3. Gera a resposta do Especialista Gemini
        response_text = self.llm.generate(messages)
        
        # 4. Lógica de intermediação
        analysis = self._determine_next_step(messages)
        
        return {
            "agent_response": response_text,
            "internal_analysis": analysis,
            "phase_suggestion": "Phase 1: Diagnosis" if len(chat_history) < 4 else "Phase 2: Solution"
        }