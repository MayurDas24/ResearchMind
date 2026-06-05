# retriever.py
import numpy as np
import faiss

from embeddings import create_embeddings


# =============================================================================
# TEXT CHUNKING
# =============================================================================
def chunk_text(text: str, chunk_size: int = 500) -> list[str]:
    """Split text into overlapping word-level chunks."""
    words = text.split()
    chunks = []
    overlap = 50  # word overlap between consecutive chunks

    i = 0
    while i < len(words):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
        i += chunk_size - overlap

    return chunks


# =============================================================================
# FAISS VECTOR STORE
# =============================================================================
def build_vector_store(chunks: list[str]):
    """
    Build a FAISS index from text chunks.

    Returns:
        index         — FAISS IndexFlatL2
        stored_chunks — list[str]  (same order as vectors)
        embeddings    — np.ndarray
    """
    if not chunks:
        raise ValueError("Cannot build vector store: chunk list is empty.")

    embeddings = create_embeddings(chunks)

    if len(embeddings) == 0:
        raise ValueError("Embedding generation returned no vectors.")

    embeddings_np = np.array(embeddings).astype("float32")
    dimension = embeddings_np.shape[1]

    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings_np)

    return index, chunks, embeddings_np


# =============================================================================
# SEMANTIC RETRIEVAL
# =============================================================================
def retrieve_relevant_chunks(
    query: str,
    index,
    chunks: list[str],
    top_k: int = 5,
) -> list[str]:
    """Return the top-k most semantically similar chunks to the query."""
    if not chunks or index is None:
        return []

    query_embedding = np.array(create_embeddings([query])).astype("float32")

    k = min(top_k, len(chunks))
    distances, indices = index.search(query_embedding, k)

    retrieved = []
    for idx in indices[0]:
        if 0 <= idx < len(chunks):
            retrieved.append(chunks[idx])

    return retrieved