# tools.py
import os
import requests
from bs4 import BeautifulSoup
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

_tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


def web_search(topic: str, max_results: int = 5) -> list[dict]:
    """
    Search the web using Tavily.
    Returns a list of dicts: [{ "title": ..., "url": ..., "content": ... }, ...]
    """
    try:
        response = _tavily_client.search(
            query=topic,
            max_results=max_results,
            include_answer=False,
        )

        results = []
        for item in response.get("results", []):
            results.append(
                {
                    "title": item.get("title", ""),
                    "url": item.get("url", ""),
                    "content": item.get("content", ""),
                }
            )

        return results

    except Exception as e:
        print(f"⚠️ web_search failed: {e}")
        return []


def scrape_url(url: str, timeout: int = 10) -> str:
    """
    Fetch a URL and extract readable text using BeautifulSoup.
    Returns cleaned text, or "" if scraping fails.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0 Safari/537.36"
        )
    }

    try:
        response = requests.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Strip non-content tags
        for tag in soup(["script", "style", "nav", "footer", "header", "noscript"]):
            tag.decompose()

        text = soup.get_text(separator=" ", strip=True)

        # Collapse excessive whitespace
        text = " ".join(text.split())

        # Cap length to keep prompts manageable
        return text[:8000]

    except Exception as e:
        print(f"⚠️ scrape_url failed for {url}: {e}")
        return ""