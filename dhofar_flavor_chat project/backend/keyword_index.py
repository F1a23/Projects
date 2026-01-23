# Build a keyword-to-recipes index for fast lookup

from collections import defaultdict
import re

def normalize_ar(text: str) -> str:
    # Normalize Arabic text for keyword matching
    if not text:
        return ""
    text = re.sub(r"[\u064B-\u065F\u0670]", "", text)
    text = text.replace("أ","ا").replace("إ","ا").replace("آ","ا")
    text = text.replace("ى","ي").replace("ة","ه")
    text = re.sub(r"\s+"," ", text).strip().lower()
    return text

def build_keyword_index(recipes):
    # Create a mapping from keyword to related recipes
    keyword_to_recipes = defaultdict(list)

    for r in recipes:
        for kw in r.get("keywords", []):
            k = normalize_ar(kw)
            if k:
                keyword_to_recipes[k].append({
                    "id": r.get("id"),
                    "name": r.get("name")
                })

    return keyword_to_recipes

if __name__ == "__main__":
    # Minimal self-test
    sample = [{
        "id": "DF-001",
        "name": "Test Dish",
        "keywords": ["شوربة", "تقليدي"]
    }]
    idx = build_keyword_index(sample)
    print("Keywords:", list(idx.keys()))
