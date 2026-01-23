# Build embeddings and FAISS vector database for recipe documents

import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

EMBED_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

def build_faiss_index(recipes):
    # Load embedding model
    embedder = SentenceTransformer(EMBED_MODEL)

    # Prepare documents for vector database
    texts = []
    for r in recipes:
        doc = (
            f"اسم: {r['name']}\n"
            f"ID: {r['id']}\n"
            f"نوع: {r.get('type','')}\n"
            f"المنطقة: {r.get('region','')}\n"
            f"طريقة الطهي: {r.get('cook_method','')}\n"
            f"الوصف: {r.get('description','')}\n"
            f"المكونات: {', '.join(r.get('ingredients', [])[:20])}\n"
            f"الكلمات المفتاحية: {', '.join(r.get('keywords', []))}\n"
            f"طريقة التحضير: {r.get('prep','')}"
        )
        texts.append(doc)

    # Generate embeddings
    emb = embedder.encode(texts, show_progress_bar=True)
    emb = np.array(emb, dtype=np.float32)

    # Create FAISS index
    index = faiss.IndexFlatL2(emb.shape[1])
    index.add(emb)

    return index, texts

if __name__ == "__main__":
    # Minimal self-test
    sample = [{
        "id": "DF-001",
        "name": "Test Dish",
        "type": "Traditional",
        "region": "Dhofar",
        "cook_method": "Boiling",
        "description": "Test description",
        "ingredients": ["لحم", "ملح"],
        "keywords": ["تقليدي"],
        "prep": "Test steps"
    }]
    idx, docs = build_faiss_index(sample)
    print("FAISS vectors:", idx.ntotal)
