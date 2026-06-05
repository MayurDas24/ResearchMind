<div align="center">

<br/>

```
██████╗ ███████╗███████╗███████╗ █████╗ ██████╗  ██████╗██╗  ██╗
██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║
██████╔╝█████╗  ███████╗█████╗  ███████║██████╔╝██║     ███████║
██╔══██╗██╔══╝  ╚════██║██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║
██║  ██║███████╗███████║███████╗██║  ██║██║  ██║╚██████╗██║  ██║
╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
                                                    M I N D
```

### **Autonomous Multi-Agent AI Research System**

*Four specialised AI agents that search, scrape, reason, write, and self-critique — end-to-end, in one click.*

<br/>

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![LangChain](https://img.shields.io/badge/LangChain-0.2+-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)](https://langchain.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-ReAct-FF6B35?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![Streamlit](https://img.shields.io/badge/Streamlit-UI-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=for-the-badge)](https://groq.com)
[![FAISS](https://img.shields.io/badge/FAISS-Vector_DB-009FDA?style=for-the-badge)](https://faiss.ai)
[![License](https://img.shields.io/badge/License-MIT-50C878?style=for-the-badge)](LICENSE)

<br/>

</div>

---

## What Is This?

ResearchMind is a **production-grade autonomous research pipeline** built from scratch using Multi-Agent Systems, Retrieval-Augmented Generation (RAG), and semantic vector search. You give it a topic — it handles everything else.

Under the hood, four independent AI agents coordinate in sequence:

1. A **Search Agent** hits the live web via Tavily's API to pull the most relevant, up-to-date sources
2. A **Reader Agent** scrapes the full HTML of those pages, strips boilerplate, and extracts clean text
3. A **Writer Chain** synthesises all gathered evidence into a structured, professional research report using a 70B LLM
4. A **Critic Chain** independently reviews the report against a weighted rubric and scores it

A semantic confidence score is then computed by embedding both the report and the source material and measuring their vector similarity — giving a quantitative signal of how well the output is grounded in evidence.

The entire pipeline is wrapped in a polished Streamlit UI with live step-by-step status tracking.


## AI/ML Concepts Implemented

| Concept | Where | Implementation Detail |
|---|---|---|
| **Multi-Agent Systems** | `agents.py` | Four independent agents with distinct roles, each with isolated toolsets and prompts |
| **ReAct Agent Pattern** | `agents.py` | LangGraph `create_react_agent` — agents reason, act with tools, observe output, iterate |
| **RAG (Retrieval-Augmented Generation)** | `retriever.py` + `app.py` | Full RAG loop: chunk → embed → index → semantic query → inject into LLM context |
| **Semantic Search** | `retriever.py` | Dense vector similarity search; L2-nearest-neighbour over sentence embeddings |
| **Vector Databases** | `retriever.py` | FAISS `IndexFlatL2` in-memory vector store with cosine-equivalent ANN retrieval |
| **Dense Text Embeddings** | `embeddings.py` | `all-MiniLM-L6-v2` via sentence-transformers; 384-dim vectors, BERT-based encoder |
| **LLM Chaining (LCEL)** | `agents.py` | LangChain Expression Language `prompt | llm | StrOutputParser()` declarative chains |
| **Structured Prompt Engineering** | `agents.py` | Role-specific system prompts with rubric-based evaluation and strict output format constraints |
| **Confidence Scoring** | `validator.py` | Cosine similarity between report embedding and chunked source embeddings; max-pool aggregation |
| **Agentic Tool Use** | `tools.py` | `@tool`-decorated functions exposed to agents as callable actions |
| **Web Scraping & Parsing** | `tools.py` | DOM traversal with BeautifulSoup; tag decomposition, text normalisation, length validation |
| **Overlapping Text Chunking** | `retriever.py` | 500-word chunks with 50-word overlap to preserve cross-boundary context for RAG |

---

## Tech Stack

### Core AI / LLM

| Technology | Version | Role |
|---|---|---|
| **LangChain** | ≥ 0.2 | Agent orchestration, LCEL chains, tool management |
| **LangGraph** | ≥ 0.1 | ReAct agent runtime (`create_react_agent`) |
| **Groq API** | — | Ultra-fast LLM inference (≤ 500ms/token on LLaMA 3.3 70B) |
| **LLaMA 3.3 70B** | — | Writer and Critic LLM — Meta's open-weight frontier model |
| **Sentence Transformers** | ≥ 2.7 | Local text embedding model (`all-MiniLM-L6-v2`) |
| **FAISS** | ≥ 1.8 | Facebook AI Similarity Search — CPU vector store |

### Data & Retrieval

| Technology | Role |
|---|---|
| **Tavily Search API** | Real-time web search with structured result extraction |
| **Requests** | HTTP client for webpage fetching |
| **BeautifulSoup4** | HTML parsing and boilerplate removal |
| **NumPy** | Embedding arrays and similarity computation |
| **scikit-learn** | `cosine_similarity` for confidence scoring |

### Frontend & Infrastructure

| Technology | Role |
|---|---|
| **Streamlit** | Web UI — live pipeline status, report rendering, download |
| **python-dotenv** | Environment variable management |

---

## Project Structure

```
researchmind/
│
├── app.py              # Streamlit UI + pipeline orchestration
├── agents.py           # Search agent, Reader agent, Writer chain, Critic chain
├── tools.py            # @tool functions: web_search (Tavily), scrape_url (BS4)
├── retriever.py        # Text chunking, FAISS vector store, semantic retrieval
├── embeddings.py       # SentenceTransformer wrapper (shared across modules)
├── validator.py        # Cosine similarity confidence scoring
├── pipeline.py         # Standalone CLI runner (runs without Streamlit)
│
├── requirements.txt    # All dependencies pinned
├── .env.example        # API key template
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- A [Groq API key](https://console.groq.com) (free tier available)
- A [Tavily API key](https://app.tavily.com) (free tier: 1000 searches/month)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/researchmind.git
cd researchmind

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
```

Open `.env` and add your keys:

```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

### Run

```bash
# Streamlit UI (recommended)
streamlit run app.py

# CLI mode (no browser required)
python pipeline.py
```

Open `http://localhost:8501` — type any research topic and hit **Run Research Pipeline**.

---

## Pipeline Walkthrough

### Step 1 — Search Agent
Uses a LangGraph `create_react_agent` with the Tavily search tool. The agent reasons about the query, invokes the tool, and processes up to 5 structured results (title, URL, full snippet). This gives the pipeline a grounded, factual foundation from live web data.

### Step 2 — Reader Agent
A second ReAct agent equipped with a custom `scrape_url` tool. It selects the most relevant URLs from search results, fetches the raw HTML via `requests`, removes all non-content tags (`<script>`, `<nav>`, `<footer>`, etc.) with BeautifulSoup, normalises whitespace, and returns up to 8,000 characters of clean body text per source.

### Step 3 — RAG Pipeline
The combined scraped text is split into 500-word overlapping chunks. Each chunk is encoded into a 384-dimensional dense vector using `all-MiniLM-L6-v2`. These vectors are loaded into a FAISS `IndexFlatL2` index. The original research topic is then embedded as a query vector and used to retrieve the top-5 most semantically relevant chunks — these form the evidence base injected into the Writer's prompt.

### Step 4 — Writer Chain
A LangChain Expression Language chain (`prompt | llm | parser`) backed by LLaMA 3.3 70B on Groq. The prompt includes the search results, RAG-retrieved chunks, and full scraped content. The Writer produces a structured Markdown report with Introduction, Key Findings, Technical Insights, Applications, Challenges, Future Scope, Conclusion, and Sources.

### Step 5 — Critic Chain
A second LCEL chain using the same LLM with a completely different system prompt. The Critic evaluates the report across five rubric dimensions — Accuracy (30%), Depth (25%), Clarity (20%), Structure (15%), Source Quality (10%) — and produces a weighted final score with explicit strengths and weaknesses.

### Step 6 — Confidence Scoring
The full report text and each source chunk are encoded independently. The cosine similarity between the report embedding and every source chunk embedding is computed; the maximum similarity is taken and scaled to a 0–10 score. This quantifies how well the report is grounded in its sources, independent of the LLM's self-assessment.

---

## Key Design Decisions

**Why LangGraph ReAct over simple function calls?**
ReAct agents can iterate — observe tool output, reason about it, and call tools again if needed. This makes the Search and Reader agents genuinely adaptive rather than rigid pipeline steps.

**Why FAISS over a managed vector DB?**
Zero infrastructure overhead. FAISS runs fully in-memory with no external services, making the entire system runnable locally with a single command. For production scale, swapping in Pinecone or Weaviate would be a straightforward change to `retriever.py`.

**Why a separate Confidence Score?**
The Critic is an LLM that can be overconfident. The cosine similarity score is computed purely from embedding geometry — no LLM involved — giving an objective, reproducible signal orthogonal to the LLM's self-evaluation.

**Why overlapping chunks in RAG?**
Standard fixed-size chunking loses context at boundaries. 50-word overlap ensures that sentences split across chunk boundaries are fully captured in at least one chunk, improving retrieval precision.

---

## Sample Output

Topic: "Tra
nsformer architecture innovations in 2025"

Pipeline completed in ~45 seconds
─────────────────────────────────────────────
✓ Search Agent     → 5 results retrieved
✓ Reader Agent     → 3 sources scraped (18,400 chars)
✓ Vector Store     → 42 chunks indexed, top-5 retrieved
✓ Writer Chain     → 1,240-word structured report generated
✓ Critic Chain     → Final Score: 7.4/10
✓ Confidence Score → 8.1/10
License

MIT License — see LICENSE for details.

Built by Mayur · B.Tech Computer Engineering · MIT Manipal

If this project helped you, a ⭐ on GitHub goes a long way.
