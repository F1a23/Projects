# pdf_store.py
import os
import uuid
from typing import List, Tuple

from pypdf import PdfReader

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

# Ollama embeddings + chat
from langchain_ollama import OllamaEmbeddings, ChatOllama

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/
PDF_DB_DIR = os.path.join(BASE_DIR, "pdf_vectorstore")
os.makedirs(PDF_DB_DIR, exist_ok=True)

EMBED_MODEL = os.getenv("EMBED_OLLAMA_MODEL", "nomic-embed-text")
LLM_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=120,
    separators=["\n\n", "\n", "•", "-", ".", "،", " "],
)

_embeddings = OllamaEmbeddings(model=EMBED_MODEL)

def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    texts = []
    for page in reader.pages:
        t = page.extract_text() or ""
        if t.strip():
            texts.append(t)
    return "\n\n".join(texts).strip()

def build_pdf_index(text: str, pdf_id: str) -> str:
    chunks = _splitter.split_text(text)
    metadatas = [{"pdf_id": pdf_id, "chunk": i} for i in range(len(chunks))]

    vs = FAISS.from_texts(chunks, embedding=_embeddings, metadatas=metadatas)
    save_path = os.path.join(PDF_DB_DIR, pdf_id)
    vs.save_local(save_path)
    return pdf_id

def ingest_pdf(pdf_path: str) -> str:
    text = extract_text_from_pdf(pdf_path)
    if not text:
        raise ValueError("PDF has no extractable text (maybe scanned).")
    pdf_id = str(uuid.uuid4())
    build_pdf_index(text, pdf_id)
    return pdf_id

def search_pdf(pdf_id: str, query: str, k: int = 4) -> List[Tuple[str, dict]]:
    load_path = os.path.join(PDF_DB_DIR, pdf_id)
    if not os.path.exists(load_path):
        raise ValueError("pdf_id not found. Upload PDF first.")
    vs = FAISS.load_local(load_path, embeddings=_embeddings, allow_dangerous_deserialization=True)
    docs = vs.similarity_search(query, k=k)
    return [(d.page_content, d.metadata) for d in docs]

def generate_from_context(context: str, question: str) -> str:
    """
    يولّد إجابة باستخدام Ollama مباشرة بناءً على سياق PDF فقط.
    هذا يمنع تداخل محرك الوصفات (answer_question) مع PDF.
    """
    llm = ChatOllama(model=LLM_MODEL, temperature=0.2)

    prompt = (
        "أنت مساعد طبخ. استخدم محتوى الوصفة داخل السياق التالي فقط.\n"
        "إذا كانت المعلومة غير موجودة في السياق، قل: (غير موجود في PDF).\n\n"
        "السياق:\n"
        f"{context}\n\n"
        f"سؤال المستخدم: {question}\n\n"
        "اكتب الإجابة بالعربية بشكل مرتب:\n"
        "1) ملخص قصير\n"
        "2) المكونات (إن وجدت)\n"
        "3) الخطوات (إن وجدت)\n"
        "4) نصائح\n"
    )

    res = llm.invoke(prompt)
    return res.content if hasattr(res, "content") else str(res)
