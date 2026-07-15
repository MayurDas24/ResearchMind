<div align="center">

# ResearchMind

**AI-powered multi-agent research platform** — enter a topic, get a fully cited, professionally formatted report in under a minute.

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-black?style=flat-square&logo=express)](https://expressjs.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=flat-square)](https://groq.com)

</div>

---

## What it does

You submit a research topic. A pipeline of specialized agents takes it from there:

**Search → Scrape → Chunk → Embed → Retrieve → Write → Critique → Score**

Progress streams live to the UI over WebSockets, and the finished report renders as a formatted document with a table of contents, confidence score, and source list — exportable as Markdown, TXT, or PDF.

## Architecture
React (Vite + TS)  →  Express + Socket.IO  →  In-memory queue  →  FastAPI (Python)
│
Tavily search → BeautifulSoup scrape
│
SentenceTransformers → FAISS retrieval
│
Groq Writer → Groq Critic → Confidence
│
MongoDB Atlas

## Tech Stack

| Layer | Stack |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, TanStack Query, Socket.IO Client, Framer Motion, react-markdown |
| **Backend** | Node.js, Express 5, TypeScript, Mongoose, Socket.IO |
| **AI Service** | FastAPI, LangChain, Groq (LLaMA 3.3 70B), Tavily Search API |
| **Retrieval** | Sentence-Transformers (`all-MiniLM-L6-v2`), FAISS, BeautifulSoup4 |
| **Database** | MongoDB Atlas |

## Features

- Live-updating dashboard with stats and recent activity
- Real-time job progress via Socket.IO (queued → searching → reading → retrieving → writing → reviewing → completed)
- GitHub-flavored Markdown report rendering with syntax-highlighted code blocks and sticky TOC
- Semantic confidence scoring (embedding cosine similarity between report and sources)
- Search, filter, and delete across research history
- Export reports as Markdown, TXT, or print-to-PDF

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas connection string
- [Groq API key](https://console.groq.com)
- [Tavily API key](https://app.tavily.com)

### Setup

```bash
git clone https://github.com/MayurDas24/ResearchMind.git
cd ResearchMind
```

**Server**
```bash
cd server
npm install
cp .env.example .env   # add MONGODB_URI, JWT_SECRET, CLIENT_URL, AI_SERVICE_URL
npm run dev
```

**AI Service**
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate        # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env         # add GROQ_API_KEY, TAVILY_API_KEY
uvicorn app:app --reload
```

**Client**
```bash
cd client
npm install
cp .env.example .env         # add VITE_API_URL, VITE_SOCKET_URL
npm run dev
```

Open `http://localhost:5173`.

## Project Structure
├── client/       React frontend (dashboard, report viewer, history)
├── server/       Express API + Socket.IO + job queue
├── ai-service/   FastAPI multi-agent research pipeline
└── docs/         Architecture notes

## License

MIT

---

<div align="center">

Built by **Mayur** · B.Tech Computer Engineering · MIT Manipal

</div>
