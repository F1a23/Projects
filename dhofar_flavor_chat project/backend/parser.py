# Parse recipes from DOCX text into structured objects

import re

def normalize_ar(text: str) -> str:
    # Normalize Arabic text for internal matching and keywords
    if not text:
        return ""
    text = re.sub(r"[\u064B-\u065F\u0670]", "", text)
    text = text.replace("أ","ا").replace("إ","ا").replace("آ","ا")
    text = text.replace("ى","ي").replace("ة","ه")
    text = re.sub(r"\s+"," ", text).strip().lower()
    return text

def parse_recipes_from_docx_text(raw_text: str):
    # Parse structured recipes from raw text using DF IDs and section headers
    lines = [l.strip() for l in raw_text.splitlines() if l.strip()]
    id_pat = re.compile(r"^ID\s*:\s*(DF-[A-Za-z0-9\-]+)\s*$", re.IGNORECASE)

    recipes = []
    cur = None
    section = None
    last_text_line = None

    def new_recipe():
        # Create a new recipe object
        return {
            "id": None,
            "name": None,
            "type": None,
            "region": None,
            "cook_method": None,
            "description": "",
            "ingredients": [],
            "prep": "",
            "keywords": []
        }

    def flush():
        # Finalize and store the current recipe if it has an ID
        nonlocal cur
        if not cur:
            return
        cur["description"] = cur["description"].strip()
        cur["prep"] = cur["prep"].strip()
        cur["keywords"] = list(set(
            normalize_ar(w)
            for w in ((cur["name"] or "").split() + (cur["type"] or "").split())
            if w
        ))
        if cur.get("id"):
            recipes.append(cur)
        cur = None

    for line in lines:
        m = id_pat.match(line)
        if m:
            flush()
            cur = new_recipe()
            cur["id"] = m.group(1).strip()
            if last_text_line and ":" not in last_text_line:
                cur["name"] = last_text_line.strip()
            else:
                cur["name"] = None
            section = None
            continue

        if not line.startswith(("نوع الأكلة", "المنطقة", "طريقة الطهي", "الوصف", "المكونات", "طريقة التحضير")):
            if len(line) <= 60:
                last_text_line = line

        if not cur:
            continue

        if "نوع الأكلة" in line:
            cur["type"] = line.split(":", 1)[-1].strip()
            continue
        if "المنطقة" in line:
            cur["region"] = line.split(":", 1)[-1].strip()
            continue
        if "طريقة الطهي" in line:
            cur["cook_method"] = line.split(":", 1)[-1].strip()
            continue

        if line.startswith("الوصف"):
            section = "description"
            continue
        if line.startswith("المكونات"):
            section = "ingredients"
            continue
        if line.startswith("طريقة التحضير"):
            section = "prep"
            continue

        if section == "description":
            cur["description"] += line + " "
        elif section == "ingredients":
            if ":" not in line and not line.startswith(("ملاحظات", "تكفي")):
                cur["ingredients"].append(line.strip())
        elif section == "prep":
            cur["prep"] += line + " "

    flush()
    return recipes

if __name__ == "__main__":
    # Minimal self-test
    sample = "اسم\nID: DF-001\nنوع الأكلة: ...\nالمكونات\nسكر\nطريقة التحضير\nخطوة\n"
    out = parse_recipes_from_docx_text(sample)
    print("Parsed:", len(out))
