import re
import numpy as np
import subprocess

def normalize_ar(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"[\u064B-\u065F\u0670]", "", text)
    text = text.replace("أ","ا").replace("إ","ا").replace("آ","ا")
    text = text.replace("ى","ي").replace("ة","ه")
    text = re.sub(r"\s+"," ", text).strip().lower()
    return text

def tokenize_ar(text: str):
    t = normalize_ar(text)
    t = re.sub(r"[^0-9\u0621-\u064A]+", " ", t)
    words = [w for w in t.split() if w]
    tokens = set(words)
    for w in words:
        if w.startswith("ال") and len(w) > 2:
            tokens.add(w[2:])
    return tokens

def canonical_term(term: str):
    t = normalize_ar(term)
    t = re.sub(r"[^0-9\u0621-\u064A]+", " ", t).strip()
    if not t:
        return ""
    if t.startswith("ال") and len(t) > 2:
        return t[2:]
    return t

def find_recipes_by_ingredient_strict(term: str, recipes):
    t = canonical_term(term)
    if not t:
        return []
    out = []
    for r in recipes:
        ing_text = " ".join(r.get("ingredients", []))
        tokens = tokenize_ar(ing_text)
        if t in tokens:
            out.append(r)
    return out

def find_recipes_general(term: str, recipes):
    t = normalize_ar(term)
    if not t:
        return []
    out = []
    for r in recipes:
        hay = " ".join([
            r.get("name",""),
            r.get("type","") or "",
            r.get("region","") or "",
            r.get("cook_method","") or "",
            r.get("description","") or "",
            " ".join(r.get("ingredients", []))
        ])
        if t in normalize_ar(hay):
            out.append(r)
    return out

def find_recipes_by_name(user_text: str, recipes):
    q = normalize_ar(user_text)
    hits = []
    for r in recipes:
        name_n = normalize_ar(r.get("name",""))
        if not name_n:
            continue
        if q == name_n or (q and q in name_n):
            hits.append(r)
    hits.sort(key=lambda x: len(normalize_ar(x.get("name",""))), reverse=True)
    return hits

def format_recipe(r: dict) -> str:
    out = f"{r.get('name','')} — ({r.get('id','')})\n"
    if r.get("type"): out += f"نوع الأكلة: {r['type']}\n"
    if r.get("region"): out += f"المنطقة: {r['region']}\n"
    if r.get("cook_method"): out += f"طريقة الطهي: {r['cook_method']}\n"

    if r.get("description"):
        out += "\nالوصف:\n" + r["description"].strip()

    if r.get("ingredients"):
        out += "\n\nالمكونات:\n" + "\n".join([f"- {x}" for x in r["ingredients"]])

    if r.get("prep"):
        out += "\n\nطريقة التحضير:\n" + r["prep"].strip()

    return out.strip()

def is_short_term(msg: str) -> bool:
    return len((msg or "").split()) <= 2

MODEL_NAME = "llama3"

DOMAIN_DISCLAIMER = (
    "تنبيه: هذا الشات يجيب فقط من وثائق (وصفات ظفار) داخل المشروع. "
    "إذا المعلومة غير موجودة في الوثائق، سيتم إرجاع: غير موجود في البيانات."
)

def retrieve_top_chunks(query: str, top_k: int, embedder, index, texts):
    q_emb = embedder.encode([query])
    q_emb = np.array(q_emb, dtype=np.float32)
    D, I = index.search(q_emb, top_k)
    return [texts[idx] for idx in I[0]]

def ollama_generate(prompt: str, model=MODEL_NAME):
    r = subprocess.run(
        ["ollama", "run", model],
        input=prompt,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="ignore"
    )
    return (r.stdout or "").strip()

def rag_answer(user_q: str, embedder, index, texts, top_k: int = 4, model=MODEL_NAME):
    chunks = retrieve_top_chunks(user_q, top_k=top_k, embedder=embedder, index=index, texts=texts)
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
    out = ollama_generate(prompt, model=model)
    return out if out else "غير موجود في البيانات"

STATE = {"options": None}

def fixed_router(msg: str, recipes, embedder=None, index=None, texts=None):
    msg = (msg or "").strip()
    if not msg:
        return "اكتبي مكوّن (لحم/سمك/تمر) أو كلمة عامة (تقليدي/تراث) أو اسم أكلة."

    if msg.isdigit() and STATE["options"]:
        idx = int(msg) - 1
        opts = STATE["options"]
        if 0 <= idx < len(opts):
            picked = opts[idx]
            STATE["options"] = None
            return format_recipe(picked)
        return "اختاري رقم صحيح من القائمة."

    if is_short_term(msg):
        strict_hits = find_recipes_by_ingredient_strict(msg, recipes)
        if strict_hits:
            STATE["options"] = strict_hits[:12]
            out = "أكلات تحتوي داخل المكونات فقط:\n\n"
            for i, r in enumerate(STATE["options"], 1):
                out += f"{i}) {r['name']} — ({r['id']})\n"
            out += "\nاكتبي رقم الأكلة لعرض التفاصيل."
            return out

        general_hits = find_recipes_general(msg, recipes)
        if general_hits:
            STATE["options"] = general_hits[:12]
            out = "ما لقيت داخل المكونات، لكن لقيتها في البحث العام:\n\n"
            for i, r in enumerate(STATE["options"], 1):
                out += f"{i}) {r['name']} — ({r['id']})\n"
            out += "\nاكتبي رقم الأكلة لعرض التفاصيل."
            return out

        return "ما لقيت نتائج."

    name_hits = find_recipes_by_name(msg, recipes)
    if name_hits:
        if len(name_hits) == 1:
            STATE["options"] = None
            return format_recipe(name_hits[0])

        STATE["options"] = name_hits[:12]
        out = "لقيت أكثر من أكلة مطابقة للااسم، اختاري رقم:\n\n"
        for i, r in enumerate(STATE["options"], 1):
            out += f"{i}) {r['name']} — ({r['id']})\n"
        out += "\nاكتبي رقم الأكلة لعرض التفاصيل."
        return out

    if embedder is not None and index is not None and texts is not None:
        return rag_answer(msg, embedder=embedder, index=index, texts=texts, top_k=4, model=MODEL_NAME)

    return "RAG غير جاهز. وفري embedder/index/texts أو شغلي خلية FAISS."
