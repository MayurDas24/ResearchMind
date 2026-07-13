# agents.py
from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent

from tools import scrape_url, web_search

load_dotenv()

# =============================================================================
# LLM
# =============================================================================
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)


# =============================================================================
# SEARCH AGENT  (LangGraph ReAct agent)
# =============================================================================
def build_search_agent():
    """Returns a compiled LangGraph ReAct agent with web_search tool."""
    return create_react_agent(model=llm, tools=[web_search])


# =============================================================================
# READER AGENT  (LangGraph ReAct agent)
# =============================================================================
def build_reader_agent():
    """Returns a compiled LangGraph ReAct agent with scrape_url tool."""
    return create_react_agent(model=llm, tools=[scrape_url])


# =============================================================================
# WRITER CHAIN
# =============================================================================
_writer_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are an expert AI research writer.

Your task is to produce professional, detailed, factual, and insightful reports.

Always:
- Explain concepts clearly with precise language
- Avoid repetition and filler phrases
- Use proper Markdown headings (##, ###)
- Synthesise information from multiple sources
- Maintain an authoritative, professional tone
- Back claims with evidence from the research provided
""",
        ),
        (
            "human",
            """Write a comprehensive research report on the topic below.

TOPIC:
{topic}

RESEARCH GATHERED:
{research}

---

Structure the report EXACTLY as follows (use these Markdown headings):

## Introduction

## Key Findings
(minimum 3 detailed, evidence-backed findings with sub-headings)

## Technical Insights

## Real-World Applications

## Challenges & Limitations

## Future Scope

## Conclusion

## Sources
(list every URL found in the research, one per line, as a Markdown list)

---

REQUIREMENTS:
- Minimum 800 words
- Be analytical, not just descriptive
- Do NOT invent facts not present in the research
- Cite URLs inline where relevant using Markdown links
""",
        ),
    ]
)

writer_chain = _writer_prompt | llm | StrOutputParser()


# =============================================================================
# CRITIC CHAIN
# =============================================================================
_critic_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a professional AI research evaluator with high standards.

Evaluate research reports on five dimensions:

1. Accuracy        (0-10) — Are facts correct and well-supported?
2. Depth           (0-10) — Is analysis thorough, not surface-level?
3. Clarity         (0-10) — Is it readable and well-written?
4. Structure       (0-10) — Is the document logically organised?
5. Source Quality  (0-10) — Are credible sources cited?

Scoring weights:
- Accuracy       → 30 %
- Depth          → 25 %
- Clarity        → 20 %
- Structure      → 15 %
- Source Quality → 10 %

Be strict and realistic. A score above 8 should be rare.
""",
        ),
        (
            "human",
            """Evaluate the following research report.

REPORT:
{report}

---

Respond in EXACTLY this format (no extra text before or after):

Accuracy: X/10
Depth: X/10
Clarity: X/10
Structure: X/10
Sources: X/10

Final Score: X/10

Strengths:
- ...
- ...
- ...

Weaknesses:
- ...
- ...
- ...

Verdict:
[2-3 sentence overall verdict]
""",
        ),
    ]
)

critic_chain = _critic_prompt | llm | StrOutputParser()