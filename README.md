# 🚀 Nexus Discovery AI - Enterprise Product Copilot

O **Nexus Discovery AI** é um copiloto inteligente projetado para o contexto de engenharia de produto e consultoria técnica de software corporativo (*Enterprise*). 

Diferente de abordagens baseadas em um único prompt genérico, o Nexus opera sob o conceito de **Cadeia de Agentes Especializados (Multi-Agent Pipeline)**. O sistema divide o ciclo de Discovery de Software (da tradução de negócio até a arquitetura tecnológica) em esteiras focadas, processando regras de negócio estritas e passando artefatos consolidados para o próximo especialista virtual.

---

## ✨ Principais Funcionalidades

- 🧠 **Cadeia de Agentes Especializados:** Separação clara entre Diagnóstico (Problem Statement), Processos (AS-IS $\rightarrow$ TO-BE) e Arquitetura.
- 📎 **Ingestão de Contexto (RAG):** Upload de atas de reunião, transcrições do Tactiq (.txt, .md), e documentações corporativas (.pdf, .docx) para fundamentar as respostas como "verdade absoluta".
- 🃏 **UI Dinâmica com Dados Estruturados:** O LLM responde com metadados estruturados (via XML/JSON embutido) que o frontend renderiza como cards interativos de projetos similares.
- 📄 **Geração de Business Case (PDF):** Consolida automaticamente o histórico do Discovery e exporta um relatório técnico (PDF) direto para a máquina do usuário.

---

## 🏗️ Arquitetura do Sistema

O projeto é dividido em um ecossistema desacoplado (Frontend e Backend), permitindo alta escalabilidade e separação de responsabilidades.

### 💻 Tech Stack
* **Backend:** Python 3.10+, FastAPI, PyPDF, Docx2txt, Google Gemini API (LLM).
* **Frontend:** React, TypeScript, Tailwind CSS, Shadcn/UI, Lucide React.
* **Inteligência:** RAG (Retrieval-Augmented Generation), Engenharia de Prompt Estruturada (Extração via Regex).

### 📂 Estrutura de Pastas

```text
📦 nexus-discovery-ai
├── 📂 backend/                  # Servidor FastAPI e Lógica de IA
│   ├── 📂 app/
│   │   ├── 📂 agent/            # Cadeia de agentes (Diagnóstico, Processos, Arquitetura)
│   │   │   └── agent.py         # Orquestrador principal e extração de XML/JSON
│   │   ├── 📂 llm/              # Clientes de Conexão com Modelos Fundacionais (Gemini)
│   │   ├── 📂 services/         # Serviços auxiliares (RAG e Geração de PDF)
│   │   └── 📂 core/             # Configurações e Prompts de Sistema
│   ├── main.py                  # Endpoints (Chat, Upload Multipart e Download de PDF)
│   └── requirements.txt         # Dependências do Python
│
└── 📂 frontend/                 # Interface de Usuário
    ├── 📂 src/
    │   └── 📂 components/       # Componentes React
    │       ├── ChatInterface.tsx# Tela principal, input e upload de arquivos
    │       ├── ChatMessage.tsx  # Renderizador de mensagens e Cards Clicáveis
    │       ├── PhaseStepper.tsx # Indicador visual de progresso do Discovery
    │       └── NexusInsightCard.tsx # Painel lateral de Insights e Matriz CSD
    ├── package.json
    └── tailwind.config.js
