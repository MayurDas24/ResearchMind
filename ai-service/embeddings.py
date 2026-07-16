from sentence_transformers import SentenceTransformer

_embedding_model = None

def get_embedding_model():
    global _embedding_model

    if _embedding_model is None:
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

    return _embedding_model


def create_embeddings(text_chunks):
    if not text_chunks:
        return []

    model = get_embedding_model()

    return model.encode(
        text_chunks,
        convert_to_tensor=False,
        show_progress_bar=False,
    )