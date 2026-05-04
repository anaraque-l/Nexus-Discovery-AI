import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env (onde estará a sua GEMINI_API_KEY)
load_dotenv()

class Settings:
    # --- Segurança & API ---
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # --- Branding Anonimizado ---
    PROJECT_NAME: str = "Nexus Discovery AI"
    SERVICE_METHODOLOGY: str = "Strategic Product Blueprint"
    
    # --- Metodologia do Framework 
    DURATION_WEEKS: int = 6
    PHASES = {
        "Phase 1": "Operational Diagnosis (Weeks 1-2) - Identifying bottlenecks and inefficiency costs.",
        "Phase 2": "Solution Architecture (Weeks 3-4) - Technical design, prototyping, and integrations.",
        "Phase 3": "Business Case (Weeks 5-6) - ROI projection, risk matrix, and execution roadmap."
    }
    
    # --- Pricing Tiers (Valores Fictícios em USD) ---
    PRICING_TIERS = {
        "Standard": {
            "price": 4500.00,
            "description": "Focus on 1 core business process, up to 6 stakeholder interviews, and 15-screen prototype.",
            "label": "Standard Discovery"
        },
        "Enterprise": {
            "price": 7500.00,
            "description": "Complex analysis of up to 3 interconnected processes, 10+ interviews, and 25-screen high-fidelity prototype.",
            "label": "Enterprise Discovery"
        }
    }
    
    # --- Esteiras de Intermediação (Downstream Services) ---
    NEXT_STEPS = {
        "SOFTWARE_DEV": {
            "focus": "Product Engineering",
            "description": "User-centric design and agile software development for custom applications."
        },
        "DATA_IA": {
            "focus": "Data Intelligence",
            "description": "Data pipelines, executive dashboards, and predictive AI models."
        }
    }

    # --- Configurações de IA ---
    # Corrigido para a versão atual e a temperatura solta para o gemini.py achar!
    MODEL_NAME: str = "gemini-2.5-flash"
    
    TEMPERATURE: float = 0.2
        
settings = Settings()