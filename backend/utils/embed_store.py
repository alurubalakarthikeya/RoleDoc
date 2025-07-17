from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
import pickle

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

VECTOR_DIR = "vector_db"
if not os.path.exists(VECTOR_DIR):
    os.makedirs(VECTOR_DIR)

def embed_and_store(text, file_name):
    # Split into chunks
    chunks = [text[i:i+500] for i in range(0, len(text), 500)]
    embeddings = model.encode(chunks)

    # Create FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings))

    # Save index
    faiss.write_index(index, os.path.join(VECTOR_DIR, f"{file_name}.index"))

    # Save chunks for later retrieval
    with open(os.path.join(VECTOR_DIR, f"{file_name}_chunks.pkl"), "wb") as f:
        pickle.dump(chunks, f)

def query_vector_store(query, file_name, top_k=3):
    # Load index and chunks
    index_path = os.path.join(VECTOR_DIR, f"{file_name}.index")
    chunks_path = os.path.join(VECTOR_DIR, f"{file_name}_chunks.pkl")

    if not os.path.exists(index_path) or not os.path.exists(chunks_path):
        return "Document not indexed."

    index = faiss.read_index(index_path)

    with open(chunks_path, "rb") as f:
        chunks = pickle.load(f)

    query_vec = model.encode([query])
    distances, indices = index.search(np.array(query_vec), top_k)

    results = [chunks[i] for i in indices[0]]
    return "\n\n".join(results)
