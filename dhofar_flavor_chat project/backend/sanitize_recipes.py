import re

def _clean_text_field(text: str) -> str:
    if not text:
        return ""
    t = str(text).strip()

    cut_markers = [
        r"\bتكفي\s*كم\s*شخص\b",
        r"\bالكلمات\s*المفتاحية\b",
    ]
    for m in cut_markers:
        t = re.split(m, t, maxsplit=1)[0].strip()

    t = re.split(
        r"\n\s*[\u0600-\u06FF0-9 ()\-\–—_]+?\s*—\s*\(DF-\d+\)\s*\n",
        t,
        maxsplit=1
    )[0].strip()

    t = re.split(r"\n\s*ID\s*:\s*DF-\d+\s*\n", t, maxsplit=1)[0].strip()
    t = re.split(r"\n\s*DF-\d+\s*\n", t, maxsplit=1)[0].strip()

    t = re.sub(r"\n{3,}", "\n\n", t).strip()
    return t

def _clean_ingredients_list(ings):
    if not ings:
        return []
    cleaned = []
    for x in ings:
        s = _clean_text_field(x)
        s = re.sub(r"^\s*[-•]+\s*", "", s).strip()
        if s:
            cleaned.append(s)
    return cleaned

def sanitize_recipes(recipes_list):
    for r in recipes_list:
        r["name"] = (r.get("name") or "").strip()
        r["description"] = _clean_text_field(r.get("description", ""))
        r["prep"] = _clean_text_field(r.get("prep", ""))

        r["ingredients"] = _clean_ingredients_list(r.get("ingredients", []))

        for k in ["keywords", "key_words", "tags", "serves", "portion", "تكفي", "كلمات_مفتاحية"]:
            if k in r:
                r.pop(k, None)

    return recipes_list
