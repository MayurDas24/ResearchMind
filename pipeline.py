# pipeline.py  —  standalone CLI runner (not used by Streamlit app)
from agents import build_reader_agent, build_search_agent, critic_chain, writer_chain


def run_research_pipeline(topic: str) -> dict:
    state = {}

    # ── Step 1 : Search ────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("STEP 1 — Search Agent")
    print("=" * 60)

    search_agent = build_search_agent()
    search_result = search_agent.invoke(
        {
            "messages": [
                (
                    "user",
                    f"Find recent, reliable and detailed information about: {topic}",
                )
            ]
        }
    )
    state["search_results"] = search_result["messages"][-1].content
    print(state["search_results"])

    # ── Step 2 : Reader ────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("STEP 2 — Reader Agent (scraping top sources)")
    print("=" * 60)

    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke(
        {
            "messages": [
                (
                    "user",
                    f"Based on the following search results about '{topic}', "
                    f"pick the most relevant URL and scrape it for deeper content.\n\n"
                    f"Search Results:\n{state['search_results'][:800]}",
                )
            ]
        }
    )
    state["scraped_content"] = reader_result["messages"][-1].content
    print(state["scraped_content"])

    # ── Step 3 : Writer ────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("STEP 3 — Writer Chain")
    print("=" * 60)

    research_combined = (
        f"SEARCH RESULTS:\n{state['search_results']}\n\n"
        f"DETAILED SCRAPED CONTENT:\n{state['scraped_content']}"
    )

    state["report"] = writer_chain.invoke(
        {"topic": topic, "research": research_combined}
    )
    print(state["report"])

    # ── Step 4 : Critic ────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("STEP 4 — Critic Chain")
    print("=" * 60)

    state["feedback"] = critic_chain.invoke({"report": state["report"]})
    print(state["feedback"])

    return state


if __name__ == "__main__":
    topic = input("Enter a research topic: ").strip()
    run_research_pipeline(topic)