# tools.py
import os
import re

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain.tools import tool
from tavily import TavilyClient

load_dotenv()

# =============================================================================
# TAVILY CLIENT
# =============================================================================
_tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


# =============================================================================
# WEB SEARCH TOOL
# =============================================================================
@tool
def web_search(query: str) -> list:
    """Search the web using Tavily and return structured results."""
    try:
        response = _tavily.search(
            query=query,
            max_results=5,
            search_depth="advanced",
        )
        return response.get("results", [])
    except Exception as e:
        print(f"[web_search] Error: {e}")
        return []


# =============================================================================
# URL SCRAPER TOOL
# =============================================================================
@tool
def scrape_url(url: str) -> str:
    """Scrape clean text content from a webpage URL."""
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        }
        resp = requests.get(url, headers=headers, timeout=15)
        if resp.status_code != 200:
            return ""

        soup = BeautifulSoup(resp.text, "html.parser")

        # Strip boilerplate tags
        for tag in soup(["script", "style", "nav", "footer", "header", "aside", "noscript"]):
            tag.decompose()

        text = soup.get_text(separator=" ", strip=True)
        text = re.sub(r"\s+", " ", text)

        if len(text) < 200:
            return ""

        return text[:8000]
    except Exception as e:
        print(f"[scrape_url] Error: {e}")
        return ""