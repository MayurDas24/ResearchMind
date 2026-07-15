from fastapi import FastAPI
from pydantic import BaseModel
from pipeline import run_research_pipeline

app = FastAPI(title="ResearchMind AI")


class ResearchRequest(BaseModel):
    topic: str


@app.get("/")
def health():
    return {
        "service": "ResearchMind AI",
        "status": "running",
    }


@app.post("/research")
def research(request: ResearchRequest):
    result = run_research_pipeline(request.topic)

    return {
        "report": result["report"],
        "feedback": result["feedback"],
        "confidence": result["confidence"],
        "sources": result["sources"],
        "scraped_content": result["scraped_content"],
    }