# embeddings.py
from sentence_transformers import SentenceTransformer

# Shared embedding model (loaded once)
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


def create_embeddings(text_chunks: list[str]) -> list:
    """
    Encode a list of text chunks into dense vector embeddings.
    Returns a list of numpy arrays.
    """
    if not text_chunks:
        return []

    embeddings = embedding_model.encode(
        text_chunks,
        convert_to_tensor=False,
        show_progress_bar=False,
    )
    return embeddings