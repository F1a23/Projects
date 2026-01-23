# RAG pipeline: FAISS retrieval + Ollama generation (domain-restricted)

import subprocess
import numpy as np

DOMAIN_DISCLAIMER = (
    "تنبيه: هذا الشات يجيب فقط من وثائق (وصفات ظفار) داخل المشروع. "
    "إذا المعلومة غير موجودة في الوثائق، سيتم إرجاع: غير موجود في البيانات."
)

def retrieve_top_chunks(query: str, embedder, index, texts, top_k: int = 4):
    # Encode the user query and retrieve top-k similar chunks from FAISS
    q_emb = embedder.encode([query])
    q_emb = np.array(q_emb, dtype=np.float32)
    D, I = index.search(q_emb, top_k)
    chunks = []
    for idx in I[0]:
        chunks.append(texts[idx])
    return chunks

def ollama_generate(prompt: str, model="llama3"):
    # Run Ollama model and return generated text
    r = subprocess.run(
        ["ollama", "run", model],
        input=prompt,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="ignore"
    )
    return (r.stdout or "").strip()

def rag_answer(user_q: str, embedder, index, texts, model="llama3"):
    # Build RAG prompt using retrieved chunks and strict domain rules
    chunks = retrieve_top_chunks(user_q, embedder, index, texts, top_k=4)
    context = "\n\n---\n\n".join(chunks)

    prompt = f"""
{DOMAIN_DISCLAIMER}
قواعد مهمة:
- استخدم (السياق) فقط.
- إذا لم تجد الإجابة في السياق، اكتب بالضبط: غير موجود في البيانات
- لا تخمّن ولا تضف معلومات خارج السياق.

السياق:
{context}

سؤال المستخدم:
{user_q}

الإجابة:
"""
    return ollama_generate(prompt, model=model)
