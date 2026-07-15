from agents import writer_chain, critic_chain
from tools import web_search, scrape_url
from validator import calculate_confidence


def run_research_pipeline(topic: str) -> dict:
    state = {}

    # ==========================================================
    # STEP 1 — SEARCH
    # ==========================================================
    print("\n" + "=" * 60)
    print("STEP 1 — SEARCH")
    print("=" * 60)

    search_results = web_search(topic)

    state["search_results"] = search_results

    print(f"Found {len(search_results)} search results")

    # ==========================================================
    # STEP 2 — SCRAPE TOP URLS
    # ==========================================================
    print("\n" + "=" * 60)
    print("STEP 2 — SCRAPING")
    print("=" * 60)

    scraped_content = ""
    sources = []

    for result in search_results[:3]:

        url = result.get("url")

        if not url:
            continue

        print(f"Scraping -> {url}")

        text = scrape_url(url)

        if text:
            scraped_content += "\n\n" + text
            sources.append(url)

    state["scraped_content"] = scraped_content
    state["sources"] = sources

    print(f"Collected {len(scraped_content)} characters")

    # ==========================================================
    # STEP 3 — WRITER
    # ==========================================================
    print("\n" + "=" * 60)
    print("STEP 3 — WRITER")
    print("=" * 60)

    search_summary = ""

    for result in search_results:

        search_summary += f"""
Title: {result.get("title","")}

URL: {result.get("url","")}

Content:
{result.get("content","")}

----------------------------------------
"""

    research_context = f"""

SEARCH RESULTS

{search_summary}

=====================================================

SCRAPED CONTENT

{scraped_content}

"""

    report = writer_chain.invoke(
        {
            "topic": topic,
            "research": research_context,
        }
    )

    state["report"] = report

    print("Report Generated")

    # ==========================================================
    # STEP 4 — CRITIC
    # ==========================================================
    print("\n" + "=" * 60)
    print("STEP 4 — CRITIC")
    print("=" * 60)

    feedback = critic_chain.invoke(
        {
            "report": report,
        }
    )

    state["feedback"] = feedback

    print("Critic Finished")

    # ==========================================================
    # STEP 5 — CONFIDENCE
    # ==========================================================
    print("\n" + "=" * 60)
    print("STEP 5 — CONFIDENCE")
    print("=" * 60)

    confidence = calculate_confidence(
        report,
        scraped_content,
    )

    state["confidence"] = confidence

    print(f"Confidence : {confidence}/10")

    # ==========================================================
    # RETURN
    # ==========================================================

    return {
        "report": state["report"],
        "feedback": state["feedback"],
        "confidence": state["confidence"],
        "sources": state["sources"],
        "scraped_content": state["scraped_content"],
    }


if __name__ == "__main__":

    topic = input("Enter a research topic: ")

    result = run_research_pipeline(topic)

    print("\n")
    print("=" * 80)
    print("FINAL REPORT")
    print("=" * 80)
    print(result["report"])