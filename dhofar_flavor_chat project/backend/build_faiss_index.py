import os
import re
import pickle
from dotenv import load_dotenv

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/

FAISS_PATH_ENV = os.getenv("FAISS_PATH", os.path.join("vectorstore", "faiss_index"))
FAISS_PATH = FAISS_PATH_ENV if os.path.isabs(FAISS_PATH_ENV) else os.path.join(BASE_DIR, FAISS_PATH_ENV)

EMBED_OLLAMA_MODEL = os.getenv("EMBED_OLLAMA_MODEL", "nomic-embed-text")

PROJECT_ROOT = os.path.dirname(BASE_DIR)
RECIPES_PKL = os.path.join(PROJECT_ROOT, "data", "processed", "recipes.pkl")

if not os.path.exists(RECIPES_PKL):
    raise FileNotFoundError(f"recipes.pkl not found at: {RECIPES_PKL}")

with open(RECIPES_PKL, "rb") as f:
    recipes = pickle.load(f)

def strip_keywords_anywhere(text: str) -> str:
    if not text:
        return ""
    t = str(text)
    t = re.split(r"(?:الكلمات\s+المفتاحية|كلمات\s+مفتاحية)\s*:\s*", t, maxsplit=1)[0]
    return t.strip()

def extract_keywords_text(text: str) -> str:
    if not text:
        return ""
    parts = re.split(r"(?:الكلمات\s+المفتاحية|كلمات\s+مفتاحية)\s*:\s*", str(text), maxsplit=1)
    return parts[1].strip() if len(parts) == 2 else ""

docs = []
for r in recipes:
    dish_id = (r.get("id") or "").strip()
    dish_title = (r.get("name") or "").strip()
    region = (r.get("region") or "").strip()
    dish_type = (r.get("type") or "").strip()
    cook_method = (r.get("cook_method") or "").strip()

    description_raw = r.get("description", "") or ""
    prep_raw = r.get("prep", "") or ""

    description = strip_keywords_anywhere(description_raw)
    prep = strip_keywords_anywhere(prep_raw)

    kw = " ".join([extract_keywords_text(description_raw), extract_keywords_text(prep_raw)]).strip()
    ings = r.get("ingredients") or []

    parts = []
    if dish_title:
        parts.append(f"اسم الطبق: {dish_title}")
    if dish_id:
        parts.append(f"ID: {dish_id}")
    if dish_type:
        parts.append(f"نوع الأكلة: {dish_type}")
    if region:
        parts.append(f"المنطقة: {region}")
    if cook_method:
        parts.append(f"طريقة الطهي: {cook_method}")
    if description:
        parts.append("الوصف:\n" + description.strip())
    if ings:
        parts.append("المكونات:\n" + "\n".join([f"- {x}" for x in ings]))
    if prep:
        parts.append("طريقة التحضير:\n" + prep.strip())
    if kw:
        parts.append("الكلمات المفتاحية:\n" + kw)

    content = "\n\n".join(parts).strip()
    docs.append(
        Document(
            page_content=content,
            metadata={
                "source": "recipes.pkl",
                "dish_id": dish_id,
                "dish_title": dish_title,
            },
        )
    )

embeddings = OllamaEmbeddings(model=EMBED_OLLAMA_MODEL)

os.makedirs(FAISS_PATH, exist_ok=True)

# حذف ملفات الفهرس القديمة
for fn in ["index.faiss", "index.pkl"]:
    fp = os.path.join(FAISS_PATH, fn)
    if os.path.exists(fp):
        os.remove(fp)

db = FAISS.from_documents(docs, embeddings)
db.save_local(FAISS_PATH)

print("✅ FAISS index built successfully!")
print("FAISS_PATH:", FAISS_PATH)
print("EMBED_OLLAMA_MODEL:", EMBED_OLLAMA_MODEL)
print("Documents:", len(docs))
