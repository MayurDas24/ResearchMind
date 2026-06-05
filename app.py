# app.py
import html
import time

import streamlit as st

from agents import critic_chain, writer_chain
from retriever import build_vector_store, chunk_text, retrieve_relevant_chunks
from tools import scrape_url, web_search
from validator import calculate_confidence

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="ResearchMind · AI Research Agent",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Custom CSS ────────────────────────────────────────────────────────────────
st.markdown(
    """
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

html, body, [class*="css"] { font-family: 'DM Sans', sans-serif; color: #e8e4dc; }

.stApp {
    background: #09090e;
    background-image:
        radial-gradient(ellipse 80% 50% at 18% -8%,  rgba(255,130,40,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 55% 40% at 82% 108%, rgba(255,70,20,0.09)  0%, transparent 55%);
}
#MainMenu, footer, header { visibility: hidden; }
.block-container { padding: 2rem 3rem 5rem; max-width: 1260px; }

/* ── Hero ── */
.hero { text-align:center; padding:3.5rem 0 2rem; }
.hero-eyebrow {
    font-family:'DM Mono',monospace; font-size:0.68rem; font-weight:500;
    letter-spacing:0.28em; text-transform:uppercase; color:#ff8c32;
    margin-bottom:1rem; opacity:0.85;
}
.hero h1 {
    font-family:'Syne',sans-serif; font-size:clamp(2.8rem,6vw,5rem);
    font-weight:800; line-height:1.0; letter-spacing:-0.03em;
    color:#f0ebe0; margin:0 0 1rem;
}
.hero h1 span { color:#ff8c32; }
.hero-sub {
    font-size:1.02rem; font-weight:300; color:#9a9088;
    max-width:520px; margin:0 auto; line-height:1.7;
}
.divider {
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,140,50,0.28),transparent);
    margin:1.8rem 0;
}

/* ── Input card ── */
.input-card {
    background:rgba(255,255,255,0.028);
    border:1px solid rgba(255,140,50,0.16);
    border-radius:16px; padding:2rem 2.2rem; margin-bottom:1.5rem;
}

/* ── Streamlit overrides ── */
.stTextInput > div > div > input {
    background:rgba(255,255,255,0.05) !important;
    border:1px solid rgba(255,140,50,0.26) !important;
    border-radius:10px !important; color:#f0ebe0 !important;
    font-family:'DM Sans',sans-serif !important; font-size:1rem !important;
    padding:0.75rem 1rem !important;
    transition:border-color 0.2s, box-shadow 0.2s !important;
}
.stTextInput > div > div > input:focus {
    border-color:#ff8c32 !important;
    box-shadow:0 0 0 3px rgba(255,140,50,0.12) !important;
}
.stTextInput > label {
    font-family:'DM Mono',monospace !important; font-size:0.7rem !important;
    letter-spacing:0.16em !important; text-transform:uppercase !important;
    color:#ff8c32 !important; font-weight:500 !important;
}
.stButton > button {
    background:linear-gradient(135deg,#ff8c32 0%,#ff5018 100%) !important;
    color:#09090e !important; font-family:'Syne',sans-serif !important;
    font-weight:700 !important; font-size:0.95rem !important;
    letter-spacing:0.04em !important; border:none !important;
    border-radius:10px !important; padding:0.72rem 2.2rem !important;
    width:100%; cursor:pointer !important;
    transition:transform 0.15s,box-shadow 0.15s,opacity 0.15s !important;
    box-shadow:0 4px 20px rgba(255,140,50,0.3) !important;
}
.stButton > button:hover {
    transform:translateY(-2px) !important;
    box-shadow:0 8px 28px rgba(255,140,50,0.42) !important;
}
.stButton > button:active { transform:translateY(0) !important; }

/* ── Pipeline step cards ── */
.step-card {
    background:rgba(255,255,255,0.025);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; padding:1.3rem 1.6rem; margin-bottom:1rem;
    position:relative; overflow:hidden; transition:border-color 0.3s;
}
.step-card.active { border-color:rgba(255,140,50,0.45); background:rgba(255,140,50,0.045); }
.step-card.done   { border-color:rgba(80,200,120,0.3);  background:rgba(80,200,120,0.03);  }
.step-card::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
    border-radius:14px 0 0 14px; background:rgba(255,255,255,0.05);
    transition:background 0.3s;
}
.step-card.active::before { background:#ff8c32; }
.step-card.done::before   { background:#50c878; }
.step-header { display:flex; align-items:center; gap:0.8rem; margin-bottom:0.2rem; }
.step-num {
    font-family:'DM Mono',monospace; font-size:0.65rem; font-weight:500;
    letter-spacing:0.15em; color:#ff8c32; opacity:0.7;
}
.step-title { font-family:'Syne',sans-serif; font-size:0.93rem; font-weight:700; color:#f0ebe0; }
.step-status { margin-left:auto; font-family:'DM Mono',monospace; font-size:0.65rem; letter-spacing:0.1em; }
.status-waiting { color:#444; }
.status-running { color:#ff8c32; }
.status-done    { color:#50c878; }
.step-desc { font-size:0.8rem; color:#665e58; margin-top:0.2rem; }

/* ── Result panels ── */
.result-panel {
    background:rgba(255,255,255,0.022); border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; padding:1.6rem 1.8rem; margin:0.8rem 0 1.2rem;
}
.result-panel-title {
    font-family:'DM Mono',monospace; font-size:0.68rem; font-weight:500;
    letter-spacing:0.2em; text-transform:uppercase; color:#ff8c32;
    margin-bottom:0.9rem; padding-bottom:0.6rem;
    border-bottom:1px solid rgba(255,140,50,0.15);
}
.result-content {
    font-size:0.88rem; line-height:1.8; color:#c8c0b8;
    white-space:pre-wrap; font-family:'DM Mono',monospace;
    max-height:340px; overflow-y:auto;
}

/* ── Report & feedback panels ── */
.report-panel {
    background:rgba(255,255,255,0.022); border:1px solid rgba(255,140,50,0.22);
    border-radius:16px; padding:2rem 2.4rem; margin-top:1rem;
}
.feedback-panel {
    background:rgba(255,255,255,0.022); border:1px solid rgba(80,200,120,0.22);
    border-radius:16px; padding:2rem 2.4rem; margin-top:1rem;
}
.panel-label {
    font-family:'DM Mono',monospace; font-size:0.68rem; letter-spacing:0.2em;
    text-transform:uppercase; margin-bottom:1.1rem; padding-bottom:0.65rem;
}
.panel-label.orange { color:#ff8c32; border-bottom:1px solid rgba(255,140,50,0.16); }
.panel-label.green  { color:#50c878; border-bottom:1px solid rgba(80,200,120,0.16); }

/* ── Confidence score ── */
.conf-score { font-size:3rem; font-weight:800; font-family:'Syne',sans-serif; color:#50c878; }
.conf-bar-bg {
    background:rgba(255,255,255,0.06); border-radius:99px;
    height:8px; margin:0.8rem 0 1rem; overflow:hidden;
}
.conf-bar-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,#50c878,#3aaa62); }

/* ── Section heading ── */
.section-heading {
    font-family:'Syne',sans-serif; font-size:1.25rem; font-weight:700;
    color:#f0ebe0; margin:1.8rem 0 0.9rem;
}
/* ── Notice ── */
.notice {
    font-family:'DM Mono',monospace; font-size:0.7rem; color:#484038;
    text-align:center; margin-top:3rem; letter-spacing:0.08em;
}
/* ── Scrollbar ── */
::-webkit-scrollbar { width:5px; height:5px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:#333; border-radius:99px; }
</style>
""",
    unsafe_allow_html=True,
)


# ── Helpers ───────────────────────────────────────────────────────────────────
def _esc(text: str) -> str:
    """HTML-escape user-generated text before inserting into unsafe HTML."""
    return html.escape(str(text))


def step_card(num: str, title: str, state: str, desc: str = "") -> None:
    status_map = {
        "waiting": ("WAITING", "status-waiting"),
        "running": ("● RUNNING", "status-running"),
        "done": ("✓ DONE", "status-done"),
    }
    label, cls = status_map.get(state, ("", ""))
    card_cls = {"running": "active", "done": "done"}.get(state, "")
    desc_html = f'<div class="step-desc">{_esc(desc)}</div>' if desc else ""
    st.markdown(
        f"""
        <div class="step-card {card_cls}">
            <div class="step-header">
                <span class="step-num">{_esc(num)}</span>
                <span class="step-title">{_esc(title)}</span>
                <span class="step-status {cls}">{label}</span>
            </div>
            {desc_html}
        </div>
        """,
        unsafe_allow_html=True,
    )


# ── Session state init ────────────────────────────────────────────────────────
if "results" not in st.session_state:
    st.session_state.results = {}
if "running" not in st.session_state:
    st.session_state.running = False
if "done" not in st.session_state:
    st.session_state.done = False


# ── Hero ──────────────────────────────────────────────────────────────────────
st.markdown(
    """
<div class="hero">
    <div class="hero-eyebrow">Multi-Agent AI System</div>
    <h1>Research<span>Mind</span></h1>
    <p class="hero-sub">
        Four specialised AI agents collaborate — searching, scraping, writing,
        and critiquing — to deliver a polished research report on any topic.
    </p>
</div>
<div class="divider"></div>
""",
    unsafe_allow_html=True,
)

# ── Layout ────────────────────────────────────────────────────────────────────
col_input, col_spacer, col_pipeline = st.columns([5, 0.4, 4])

with col_input:
    st.markdown('<div class="input-card">', unsafe_allow_html=True)
    topic = st.text_input(
        "Research Topic",
        placeholder="e.g. Quantum computing breakthroughs in 2025",
        key="topic_input",
    )
    run_btn = st.button("⚡  Run Research Pipeline", use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

    # Example chips (decorative)
    st.markdown(
        """
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.5rem;align-items:center;">
        <span style="font-family:'DM Mono',monospace;font-size:0.66rem;color:#504840;letter-spacing:0.1em;">TRY →</span>
        <span style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
            border-radius:6px;padding:0.22rem 0.65rem;font-size:0.74rem;color:#9a9088;font-family:'DM Sans',sans-serif;">
            LLM agents 2025</span>
        <span style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
            border-radius:6px;padding:0.22rem 0.65rem;font-size:0.74rem;color:#9a9088;font-family:'DM Sans',sans-serif;">
            CRISPR gene editing</span>
        <span style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
            border-radius:6px;padding:0.22rem 0.65rem;font-size:0.74rem;color:#9a9088;font-family:'DM Sans',sans-serif;">
            Fusion energy progress</span>
    </div>
    """,
        unsafe_allow_html=True,
    )

with col_pipeline:
    st.markdown('<div class="section-heading">Pipeline</div>', unsafe_allow_html=True)
    r = st.session_state.results

    def _step_state(step_key: str) -> str:
        steps = ["search", "reader", "writer", "critic"]
        if step_key in r:
            return "done"
        if st.session_state.running:
            # First step not yet in results is "running"
            for k in steps:
                if k not in r:
                    return "running" if k == step_key else "waiting"
        return "waiting"

    step_card("01", "Search Agent", _step_state("search"), "Gathers recent web information")
    step_card("02", "Reader Agent", _step_state("reader"), "Scrapes & extracts deep content")
    step_card("03", "Writer Chain", _step_state("writer"), "Drafts the full research report")
    step_card("04", "Critic Chain", _step_state("critic"), "Reviews & scores the report")


# ── Trigger ───────────────────────────────────────────────────────────────────
if run_btn:
    if not topic.strip():
        st.warning("Please enter a research topic first.")
    else:
        st.session_state.results = {}
        st.session_state.running = True
        st.session_state.done = False
        st.rerun()


# ── Pipeline execution ────────────────────────────────────────────────────────
if st.session_state.running and not st.session_state.done:

    topic_val: str = st.session_state.topic_input
    results: dict = {}

    # ── Step 1 · Search ───────────────────────────────────────────────────────
    with st.spinner("🔍 Search Agent is gathering information…"):
        try:
            search_results = web_search.run(topic_val)

            if not search_results:
                st.error("Search returned no results. Check your TAVILY_API_KEY.")
                st.session_state.running = False
                st.stop()

            formatted_search = ""
            for item in search_results:
                formatted_search += (
                    f"TITLE:\n{item.get('title','')}\n\n"
                    f"URL:\n{item.get('url','')}\n\n"
                    f"CONTENT:\n{item.get('content','')}\n\n"
                    f"{'='*50}\n"
                )

            results["search"] = formatted_search
            st.session_state.results = dict(results)

        except Exception as exc:
            st.error(f"Search Error: {exc}")
            st.session_state.running = False
            st.stop()

    # ── Step 2 · Scrape ───────────────────────────────────────────────────────
    with st.spinner("📄 Reader Agent is scraping sources…"):
        try:
            combined_scraped_text = ""

            for item in search_results[:3]:
                url = item.get("url", "")
                tavily_content = item.get("content", "")

                scraped = scrape_url.run(url)
                final_content = scraped if scraped else tavily_content

                if final_content and len(final_content) > 100:
                    combined_scraped_text += (
                        f"SOURCE URL:\n{url}\n\n"
                        f"SOURCE CONTENT:\n{final_content}\n\n"
                        f"{'='*50}\n"
                    )

            if not combined_scraped_text.strip():
                # Fall back to raw search content
                combined_scraped_text = formatted_search

            results["reader"] = combined_scraped_text
            st.session_state.results = dict(results)

        except Exception as exc:
            st.error(f"Scraping Error: {exc}")
            st.session_state.running = False
            st.stop()

    # ── Step 2b · Vector store / RAG ─────────────────────────────────────────
    with st.spinner("🧠 Building semantic knowledge base…"):
        try:
            chunks = chunk_text(combined_scraped_text)

            if chunks:
                index, stored_chunks, _ = build_vector_store(chunks)
                relevant_chunks = retrieve_relevant_chunks(
                    topic_val, index, stored_chunks, top_k=5
                )
                semantic_context = "\n\n".join(relevant_chunks)
            else:
                semantic_context = combined_scraped_text[:3000]

            results["retrieved_chunks"] = semantic_context
            st.session_state.results = dict(results)

        except Exception as exc:
            st.warning(f"Vector store warning (non-fatal): {exc}")
            semantic_context = combined_scraped_text[:3000]

    # ── Step 3 · Writer ───────────────────────────────────────────────────────
    with st.spinner("✍️ Writer Chain is drafting the report…"):
        try:
            research_combined = (
                f"SEARCH RESULTS:\n{formatted_search}\n\n"
                f"SEMANTICALLY RETRIEVED CONTEXT:\n{semantic_context}\n\n"
                f"MULTI-SOURCE SCRAPED DATA:\n{combined_scraped_text}"
            )

            final_report = writer_chain.invoke(
                {"topic": topic_val, "research": research_combined}
            )

            results["writer"] = final_report
            st.session_state.results = dict(results)

        except Exception as exc:
            st.error(f"Writer Error: {exc}")
            st.session_state.running = False
            st.stop()

    # ── Step 4 · Critic ───────────────────────────────────────────────────────
    with st.spinner("🧐 Critic Chain is evaluating the report…"):
        try:
            critic_feedback = critic_chain.invoke({"report": final_report})
            results["critic"] = critic_feedback
            st.session_state.results = dict(results)

        except Exception as exc:
            st.error(f"Critic Error: {exc}")
            st.session_state.running = False
            st.stop()

    # ── Step 5 · Confidence score ─────────────────────────────────────────────
    with st.spinner("📊 Calculating confidence score…"):
        try:
            confidence_score = calculate_confidence(final_report, combined_scraped_text)
            results["confidence"] = confidence_score
            st.session_state.results = dict(results)
        except Exception as exc:
            st.warning(f"Confidence scoring warning: {exc}")
            results["confidence"] = 0.0

    # ── Done ──────────────────────────────────────────────────────────────────
    st.session_state.running = False
    st.session_state.done = True
    st.rerun()


# ── Results display ───────────────────────────────────────────────────────────
r = st.session_state.results

if r:
    st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
    st.markdown('<div class="section-heading">Results</div>', unsafe_allow_html=True)

    # Raw search results
    if "search" in r:
        with st.expander("🔍 Search Results (raw)", expanded=False):
            st.markdown(
                f'<div class="result-panel">'
                f'<div class="result-panel-title">Search Agent Output</div>'
                f'<div class="result-content">{_esc(r["search"])}</div>'
                f"</div>",
                unsafe_allow_html=True,
            )

    # Scraped content
    if "reader" in r:
        with st.expander("📄 Scraped Content (raw)", expanded=False):
            st.markdown(
                f'<div class="result-panel">'
                f'<div class="result-panel-title">Reader Agent Output</div>'
                f'<div class="result-content">{_esc(r["reader"])}</div>'
                f"</div>",
                unsafe_allow_html=True,
            )

    # Final report
    if "writer" in r:
        st.markdown(
            '<div class="report-panel">'
            '<div class="panel-label orange">📝 Final Research Report</div>',
            unsafe_allow_html=True,
        )
        st.markdown(r["writer"])
        st.markdown("</div>", unsafe_allow_html=True)

        st.download_button(
            label="⬇  Download Report (.md)",
            data=r["writer"],
            file_name=f"research_report_{int(time.time())}.md",
            mime="text/markdown",
        )

    # Critic feedback
    if "critic" in r:
        st.markdown(
            '<div class="feedback-panel">'
            '<div class="panel-label green">🧐 Critic Feedback</div>',
            unsafe_allow_html=True,
        )
        st.markdown(r["critic"])
        st.markdown("</div>", unsafe_allow_html=True)

    # Confidence score
    if "confidence" in r:
        score = r["confidence"]
        fill_pct = min(int(score * 10), 100)
        st.markdown(
            f"""
            <div class="feedback-panel">
                <div class="panel-label green">📊 Research Confidence Score</div>
                <div class="conf-score">{score}<span style="font-size:1.2rem;color:#3aaa62;">/10</span></div>
                <div class="conf-bar-bg">
                    <div class="conf-bar-fill" style="width:{fill_pct}%;"></div>
                </div>
                <p style="color:#8a8880;font-size:0.85rem;margin:0;">
                    Semantic similarity between the generated report and retrieved
                    source material, computed via sentence-transformer embeddings.
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )

# ── Footer ────────────────────────────────────────────────────────────────────
st.markdown(
    """
<div class="notice">
    ResearchMind · LangChain multi-agent pipeline · Streamlit UI
</div>
""",
    unsafe_allow_html=True,
)