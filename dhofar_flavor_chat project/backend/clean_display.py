import re

def strip_keywords_anywhere(text: str) -> str:
    if not text:
        return ""
    text = re.split(r"(?:الكلمات\s+المفتاحية|كلمات\s+مفتاحية)\s*:\s*", text, maxsplit=1)[0]
    return text.strip()

def clean_recipe_for_display(r: dict) -> dict:
    rr = dict(r)
    rr["description"] = strip_keywords_anywhere(rr.get("description", ""))
    rr["prep"] = strip_keywords_anywhere(rr.get("prep", ""))
    return rr

def format_recipe(r: dict) -> str:
    r = clean_recipe_for_display(r)

    out = f"{r.get('name','')} — ({r.get('id','')})\n"
    if r.get("type"): out += f"نوع الأكلة: {r['type']}\n"
    if r.get("region"): out += f"المنطقة: {r['region']}\n"
    if r.get("cook_method"): out += f"طريقة الطهي: {r['cook_method']}\n"

    if r.get("description"):
        out += "\nالوصف:\n" + r["description"].strip()

    if r.get("ingredients"):
        out += "\n\nالمكونات:\n"
        for ing in r["ingredients"]:
            out += f"- {ing}\n"

    if r.get("prep"):
        out += "\nطريقة التحضير:\n" + r["prep"].strip()

    return out.strip()
