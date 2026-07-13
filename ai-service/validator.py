# validator.py
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from embeddings import embedding_model


def calculate_confidence(report: str, source_text: str) -> float:
    """
    Compute how well the report aligns with source material.

    Splits the source into chunks, embeds each, embeds the full report,
    and returns the max cosine similarity × 10 (capped at 10.0).
    """
    if not report.strip() or not source_text.strip():
        return 0.0

    # Chunk source text to avoid token-length issues with the encoder
    words = source_text.split()
    chunk_size = 300
    source_chunks = [
        " ".join(words[i : i + chunk_size])
        for i in range(0, len(words), chunk_size)
        if words[i : i + chunk_size]
    ]

    if not source_chunks:
        return 0.0

    report_embedding = embedding_model.encode([report], convert_to_tensor=False)
    source_embeddings = embedding_model.encode(source_chunks, convert_to_tensor=False)

    report_np = np.array(report_embedding)
    source_np = np.array(source_embeddings)

    similarities = cosine_similarity(report_np, source_np)[0]
    best_similarity = float(np.max(similarities))

    score = round(best_similarity * 10, 2)
    return min(score, 10.0)