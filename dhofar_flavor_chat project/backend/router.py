import re

def normalize_ar(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"[\u064B-\u065F\u0670]", "", text)
    text = text.replace("أ","ا").replace("إ","ا").replace("آ","ا")
    text = text.replace("ى","ي").replace("ة","ه")
    text = re.sub(r"\s+"," ", text).strip().lower()
    return text

def find_recipes_by_name(user_text: str, recipes):
    q = normalize_ar(user_text)
    hits = []
    for r in recipes:
        name_n = normalize_ar(r.get("name",""))
        if name_n and (q == name_n or q in name_n or name_n in q):
            hits.append(r)
    hits.sort(key=lambda x: len(normalize_ar(x.get("name",""))), reverse=True)
    return hits

def find_recipes_by_term(term: str, recipes):
    t = normalize_ar(term)
    if not t:
        return []
    pattern = re.compile(rf"(^|\s){re.escape(t)}(\s|$)")
    out = []
    for r in recipes:
        ing_text = normalize_ar(" ".join(r.get("ingredients", [])))
        if pattern.search(ing_text):
            out.append(r)
    return out

def format_recipe(r: dict) -> str:
    out = f"{r.get('name','')} — ({r.get('id','')})\n"
    if r.get("type"): out += f"نوع الأكلة: {r['type']}\n"
    if r.get("region"): out += f"المنطقة: {r['region']}\n"
    if r.get("cook_method"): out += f"طريقة الطهي: {r['cook_method']}\n"
    if r.get("description"): out += "\nالوصف:\n" + r["description"].strip()
    if r.get("ingredients"):
        out += "\n\nالمكونات:\n"
        for ing in r["ingredients"]:
            out += f"- {ing}\n"
    if r.get("prep"): out += "\nطريقة التحضير:\n" + r["prep"].strip()
    return out.strip()
