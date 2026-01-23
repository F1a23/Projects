import re

def normalize_ar(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"[\u064B-\u065F\u0670]", "", text)
    text = text.replace("أ","ا").replace("إ","ا").replace("آ","ا")
    text = text.replace("ى","ي").replace("ة","ه")
    text = re.sub(r"\s+"," ", text).strip().lower()
    return text

def keyword_suggest(query: str, recipes, top_k: int = 12):
    q = normalize_ar(query)
    if not q:
        return [], "none"

    pattern = re.compile(rf"(^|\s){re.escape(q)}(\s|$)")
    out = []
    for r in recipes:
        ing_text = normalize_ar(" ".join(r.get("ingredients", [])))
        if pattern.search(ing_text):
            out.append({"id": r["id"], "name": r["name"]})

    seen = set()
    uniq = []
    for it in out:
        key = (it["id"], it["name"])
        if key not in seen:
            seen.add(key)
            uniq.append(it)

    return uniq[:top_k], "direct" if uniq else "none"

def show_keyword_results(query: str, recipes):
    items, mode = keyword_suggest(query, recipes, top_k=12)
    if not items:
        return "ما لقيت أكلات تحتوي هذه الكلمة داخل المكونات."
    text = f"أكلات تحتوي ({query}) في المكونات:\n"
    for i, it in enumerate(items, 1):
        text += f"{i}) {it['name']} — ({it['id']})\n"
    text += "\nاكتبي رقم الأكلة لعرض التفاصيل."
    return text
