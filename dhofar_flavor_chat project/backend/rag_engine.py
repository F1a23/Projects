import os
import re
import pickle
import difflib
from typing import List, Dict, Optional, Tuple
from dotenv import load_dotenv

load_dotenv()

DEBUG_MATCH = os.getenv("DEBUG_MATCH", "0") == "1"

# ===================== LOAD DATA =====================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/
PROJECT_ROOT = os.path.dirname(BASE_DIR)
RECIPES_PKL = os.path.join(PROJECT_ROOT, "data", "processed", "recipes.pkl")

if not os.path.exists(RECIPES_PKL):
    raise FileNotFoundError(f"recipes.pkl not found at:\n{RECIPES_PKL}")

with open(RECIPES_PKL, "rb") as f:
    RECIPES: List[Dict] = pickle.load(f)

STATE = {"options": None, "last_intent": "all"}  # list[Dict]

# ===================== NORMALIZE =====================
_AR_DIACRITICS = r"[\u064B-\u065F\u0670]"

def normalize_ar(text: str) -> str:
    if not text:
        return ""
    t = str(text)
    t = re.sub(_AR_DIACRITICS, "", t)
    t = t.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا")
    t = t.replace("ى", "ي").replace("ة", "ه")
    t = re.sub(r"\s+", " ", t).strip().lower()
    return t

def canonical_term(term: str) -> str:
    t = normalize_ar(term)
    t = re.sub(r"[^0-9\u0621-\u064A ]+", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    if not t:
        return ""
    # شيل "ال" فقط لو جت في بداية النص نفسه
    return t[2:] if t.startswith("ال") and len(t) > 2 else t

def is_short_term(msg: str) -> bool:
    return len((msg or "").split()) <= 2

# ===================== INTENT =====================
def detect_intent(q: str) -> str:
    t = normalize_ar(q)
    wants_ing = any(w in t for w in ["مكونات", "مقادير", "المكونات", "ingredients"])
    wants_prep = any(w in t for w in ["طريقة", "تحضير", "كيف", "اسوي", "اطبخ", "خطوات", "prep", "cook"])
    if wants_ing and wants_prep:
        return "all"
    if wants_ing:
        return "ingredients"
    if wants_prep:
        return "prep"
    return "all"

# ===================== KEYWORDS EXTRACT =====================
def extract_keywords_text(text: str) -> str:
    if not text:
        return ""
    parts = re.split(r"(?:الكلمات\s+المفتاحية|كلمات\s+مفتاحية)\s*:\s*", str(text), maxsplit=1)
    return parts[1].strip() if len(parts) == 2 else ""

def strip_keywords_anywhere(text: str) -> str:
    if not text:
        return ""
    return re.split(r"(?:الكلمات\s+المفتاحية|كلمات\s+مفتاحية)\s*:\s*", str(text), maxsplit=1)[0].strip()

def keywords_only_text(r: Dict) -> str:
    desc = r.get("description", "") or ""
    prep = r.get("prep", "") or ""
    kw = " ".join([extract_keywords_text(desc), extract_keywords_text(prep)]).strip()
    return normalize_ar(kw)

# ===================== NAME MATCH (STRONG) =====================
NAME_ALIASES = {
    "قماحه": ["القماحة", "القماحه", "قماحة", "قماحه", "قمحه", "القمحه"],
    "قبولي": ["قبولي", "القبولي", "قبولة", "القبولة", "قابولي"],
}

def normalize_name(text: str) -> str:
    t = normalize_ar(text)

    # توحيد القماحة
    t = t.replace("القماحة", "القماحه").replace("قماحة", "قماحه").replace("قمحه", "قماحه")

    # توحيد القبولي
    t = t.replace("القبولي", "قبولي").replace("القبولة", "قبولة")

    parts = []
    for w in t.split():
        if w.startswith("ال") and len(w) > 2:
            parts.append(w[2:])
        else:
            parts.append(w)
    return " ".join(parts).strip()

def all_name_queries(q: str) -> List[str]:
    qn = normalize_name(q)
    out = {qn}
    for k, arr in NAME_ALIASES.items():
        kn = normalize_name(k)
        if qn == kn or qn in [normalize_name(x) for x in arr]:
            out.update([normalize_name(x) for x in arr])
    return [x for x in out if x]

def exact_name_hit(term: str, recipes: List[Dict]) -> Optional[Dict]:
    qs = all_name_queries(term)
    if not qs:
        return None
    for r in recipes:
        nm = normalize_name(r.get("name",""))
        if nm and nm in qs:
            return r
    return None

def find_by_name(term: str, recipes: List[Dict]) -> List[Dict]:
    qs = all_name_queries(term)
    if not qs:
        return []
    hits = []
    for r in recipes:
        nm = normalize_name(r.get("name",""))
        if not nm:
            continue
        if any(q == nm or q in nm or nm in q for q in qs):
            hits.append(r)
    hits.sort(key=lambda x: len(normalize_name(x.get("name",""))), reverse=True)
    return hits

def fuzzy_name_candidates(query: str, recipes: List[Dict], n: int = 6) -> List[Dict]:
    qn = normalize_name(query)
    names = [(normalize_name(r.get("name","")), r) for r in recipes if r.get("name")]
    name_only = [a for a, _ in names]
    close = difflib.get_close_matches(qn, name_only, n=n, cutoff=0.74)
    out = []
    for c in close:
        for a, r in names:
            if a == c:
                out.append(r)
    seen = set()
    uniq = []
    for r in out:
        k = normalize_name(r.get("name",""))
        if k in seen:
            continue
        seen.add(k)
        uniq.append(r)
    return uniq

# ===================== STRICT INGREDIENT MATCH (LINE BY LINE) =====================
def ingredient_patterns(term: str) -> List[str]:
    t = canonical_term(term)
    if not t:
        return []

    if t in {"لحم", "لحوم"}:
        return ["لحم", "لحمه", "لحوم", "اللحم", "اللحمه", "اللحوم"]

    if t in {"سمك", "اسماك", "أسماك"}:
        return ["سمك", "السمك", "اسماك", "أسماك", "سردين", "تونه", "تونة", "روبيان", "جمبري", "ربيان", "حبار", "قرش"]

    return [t, "ال" + t]

def word_boundary_regex(words: List[str]) -> re.Pattern:
    cleaned = [canonical_term(w) for w in words if canonical_term(w)]
    if not cleaned:
        return re.compile(r"a^")
    alt = "|".join(re.escape(w) for w in cleaned)
    pat = rf"(^|[^\u0621-\u064A0-9])({alt})([^\u0621-\u064A0-9]|$)"
    return re.compile(pat)

def ingredient_hit_reason(term: str, r: Dict) -> Optional[str]:
    pats = ingredient_patterns(term)
    rx = word_boundary_regex(pats)

    ing_list = r.get("ingredients") or []
    if not isinstance(ing_list, list):
        ing_list = [str(ing_list)]

    q = canonical_term(term)

    false_positive_context = {
        "بهارات", "توابل", "بزار", "مرق", "مكعب", "مكعبات", "بودرة", "مسحوق",
        "خلطه", "خلطة", "تتبيلة", "تتبيله"
    }

    for ing in ing_list:
        original = str(ing)
        line = normalize_ar(original)

        if not rx.search(line):
            continue

        # ✅ استثناء خاص للحم: تجاهل "بهارات لحم" / "مرق لحم" ... إلخ
        if q in {"لحم", "لحوم"}:
            tokens = set(re.sub(r"[^0-9\u0621-\u064A ]+", " ", line).split())
            if any(fp in tokens for fp in false_positive_context):
                continue

        return original

    return None

def find_by_ingredient_strict(term: str, recipes: List[Dict]) -> List[Tuple[Dict, str]]:
    out = []
    for r in recipes:
        reason = ingredient_hit_reason(term, r)
        if reason:
            out.append((r, reason))

    seen = set()
    uniq = []
    for r, reason in out:
        k = normalize_name(r.get("name",""))
        if k in seen:
            continue
        seen.add(k)
        uniq.append((r, reason))

    uniq.sort(key=lambda x: normalize_name(x[0].get("name","")))
    return uniq

# ===================== KEYWORDS STRICT =====================
def keyword_match_strict(query: str, kw_text: str) -> bool:
    if not kw_text:
        return False
    qn = normalize_ar(query)
    qn = re.sub(r"[^0-9\u0621-\u064A ]+", " ", qn)
    qn = re.sub(r"\s+", " ", qn).strip()
    if not qn:
        return False

    words = [canonical_term(w) for w in qn.split() if canonical_term(w)]
    if not words:
        return False

    for w in words:
        pat = re.compile(rf"(^|\s){re.escape(w)}(\s|$)")
        if not pat.search(kw_text):
            return False
    return True

def find_by_keywords_strict(term: str, recipes: List[Dict]) -> List[Tuple[Dict, str]]:
    out = []
    for r in recipes:
        kw = keywords_only_text(r)
        if kw and keyword_match_strict(term, kw):
            out.append((r, kw))

    seen = set()
    uniq = []
    for r, kw in out:
        k = normalize_name(r.get("name",""))
        if k in seen:
            continue
        seen.add(k)
        uniq.append((r, kw))

    uniq.sort(key=lambda x: normalize_name(x[0].get("name","")))
    return uniq

# ===================== SPECIAL: BAKED GOODS (UPDATED) =====================
BAKED_TRIGGER = {"مخبوزات", "مخبوز", "خبز", "عيش", "رقاق", "لحوح", "رغيف"}

def is_bread_recipe(r: Dict) -> bool:
    nm_raw = r.get("name","") or ""
    nm = normalize_ar(nm_raw)
    tp = normalize_ar(r.get("type","") or "")
    kw = keywords_only_text(r)

    # ✅ استثناء واضح: هذا مو خبز (يطلع ضمن الحلويات غالباً)
    if "عيش بالنارجيل" in nm:
        return False

    # خبز صريح
    if any(w in nm for w in ["خبز", "رقاق", "لحوح", "رغيف"]):
        return True

    # كلمة "عيش" لحالها قد تكون حلو/أرز... فنشترط مؤشرات خبز/مخبوزات
    if "عيش" in nm:
        if "خبز" in tp or "مخبوز" in tp:
            return True
        if keyword_match_strict("خبز", kw) or keyword_match_strict("مخبوزات", kw):
            return True
        return False

    if "خبز" in tp or "مخبوز" in tp:
        return True

    if keyword_match_strict("خبز", kw) or keyword_match_strict("مخبوزات", kw):
        return True

    return False

def find_baked_goods(recipes: List[Dict]) -> List[Dict]:
    out = [r for r in recipes if is_bread_recipe(r)]
    out.sort(key=lambda x: normalize_name(x.get("name","")))
    return out

# ===================== SPECIAL: SWEETS =====================
SWEET_TRIGGER = {"حلويات", "حلا", "تحليه", "تحلية", "حلوى", "حلو", "كيك", "كعك", "كعكه", "كعكة", "بسبوسه", "لقيمات"}

SWEET_NAME_FORCE = {"القشاط", "قشاط", "اللبنيه", "لبنيه", "اللبنية", "لبنية", "البنيه", "بنيه", "البنية", "بنية"}

def is_sweet_recipe(r: Dict) -> bool:
    nm_raw = r.get("name","") or ""
    nm = normalize_ar(nm_raw)
    tp = normalize_ar(r.get("type","") or "")
    kw = keywords_only_text(r)

    if normalize_name(nm_raw) in {normalize_name(x) for x in SWEET_NAME_FORCE}:
        return True

    if "تحليه" in tp or "تحلية" in tp:
        return True

    if any(w in nm for w in ["كيك", "كعك", "كعكه", "كعكة", "بسبوسه", "لقيمات", "حلويات", "حلا", "حلوى"]):
        return True

    for w in ["حلويات", "حلا", "تحليه", "تحلية", "حلوى", "كيك", "كعك", "بسبوسه", "لقيمات", "قشاط", "لبنيه", "لبنية", "بنيه", "بنية"]:
        if keyword_match_strict(w, kw):
            return True

    return False

def find_sweets(recipes: List[Dict]) -> List[Dict]:
    out = [r for r in recipes if is_sweet_recipe(r)]
    out.sort(key=lambda x: normalize_name(x.get("name","")))
    return out

# ===================== SPECIAL: LABNEEH KAZIB ONLY (NEW) =====================
LABNEEH_TRIGGER = {"لبنيه", "لبنية", "اللبنيه", "اللبنية", "لبنية الكزيب", "الكزيب", "كزيب"}

def is_labneeh_kazib(r: Dict) -> bool:
    nm = normalize_name(r.get("name","") or "")
    return ("لبنيه" in nm or "لبنية" in nm) and ("كزيب" in nm or "الكزيب" in nm)

# ===================== DISPLAY =====================
def format_recipe(r: Dict, intent: str = "all") -> str:
    r = dict(r)
    r["description"] = strip_keywords_anywhere(r.get("description", ""))
    r["prep"] = strip_keywords_anywhere(r.get("prep", ""))

    out = f"🍲 {r.get('name','')}\n"
    if r.get("type"): out += f"نوع الأكلة: {r['type']}\n"
    if r.get("region"): out += f"المنطقة: {r['region']}\n"
    if r.get("cook_method"): out += f"طريقة الطهي: {r['cook_method']}\n"

    if intent in ("all", "description"):
        if r.get("description"):
            out += "\n📝 الوصف:\n" + r["description"].strip()
        elif intent == "description":
            out += "\n📝 الوصف:\nغير موجود في مصادري"

    if intent in ("all", "ingredients"):
        if r.get("ingredients"):
            out += "\n\n🧂 المكونات:\n" + "\n".join([f"- {x}" for x in r["ingredients"]])
        elif intent == "ingredients":
            out += "\n\n🧂 المكونات:\nغير موجود في مصادري"

    if intent in ("all", "prep"):
        if r.get("prep"):
            out += "\n\n👩‍🍳 طريقة التحضير:\n" + r["prep"].strip()
        elif intent == "prep":
            out += "\n\n👩‍🍳 طريقة التحضير:\nغير موجود في مصادري"

    return out.strip()

def list_names(prefix: str, items: List[Dict], max_items: int = 80) -> str:
    out = prefix.strip() + f"\n\n🔢 العدد: {len(items)}\n\n"
    for i, r in enumerate(items[:max_items], 1):
        out += f"{i}) {r.get('name','')}\n"
    if len(items) > max_items:
        out += f"\n… (عرضنا أول {max_items} فقط)\n"
    out += "\n✍️ اكتبي رقم الاختيار."
    return out

# ===================== LONG QUESTION -> EXTRACT DISH =====================
def extract_candidate_dish(q: str) -> str:
    t = normalize_ar(q)
    t = re.sub(
        r"\b(كيف|طريقة|تحضير|اسوي|اسويها|اطبخ|اعمل|عمل|مكونات|المكونات|مقادير|وصفه|الوصفه|وش|ايش|اريد|ابي)\b",
        " ",
        t
    )
    t = re.sub(r"[^0-9\u0621-\u064A ]+", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    if not t:
        return q
    parts = t.split()
    return " ".join(parts[-3:]).strip()

# ===================== MAIN ROUTER (ingredient -> keywords -> name) =====================
def answer_question(question: str) -> str:
    q = (question or "").strip()
    if not q:
        return "اكتبي: مكوّن (لحم/سمك..) أو كلمة مفتاحية (تراثي/تقليدي..) أو (مخبوزات) أو (حلويات) أو اسم أكلة."

    intent = detect_intent(q)
    qnorm = canonical_term(q)

    # (0) اختيار رقم
    if q.isdigit() and STATE.get("options"):
        idx = int(q) - 1
        opts = STATE["options"] or []
        if 0 <= idx < len(opts):
            picked = opts[idx]
            STATE["options"] = None
            chosen_intent = STATE.get("last_intent") or "all"
            return format_recipe(picked, chosen_intent)
        return "اختاري رقم صحيح من القائمة."

    # (A) سؤال طويل -> اسم
    if not is_short_term(q):
        cand = extract_candidate_dish(q)
        ex = exact_name_hit(cand, RECIPES) or exact_name_hit(q, RECIPES)
        if ex:
            STATE["options"] = None
            return format_recipe(ex, intent)

        hits = find_by_name(cand, RECIPES) or find_by_name(q, RECIPES)
        if not hits:
            hits = fuzzy_name_candidates(cand, RECIPES) or fuzzy_name_candidates(q, RECIPES)

        if hits:
            if len(hits) == 1:
                STATE["options"] = None
                return format_recipe(hits[0], intent)
            STATE["options"] = hits
            STATE["last_intent"] = intent
            return list_names("✅ لقيت أكثر من أكلة محتملة من سؤالك، اختاري رقم:", hits, 80)

    # (B) مخبوزات
    if qnorm in BAKED_TRIGGER:
        baked = find_baked_goods(RECIPES)
        if baked:
            STATE["options"] = baked
            STATE["last_intent"] = "all"
            return list_names("✅ تم إيجاد أنواع المخبوزات/الخبز فقط، اختاري رقم:", baked, 80)
        return "غير موجود في مصادري"

    # ✅ (B.5) لبنية الكزيب فقط (قبل الحلويات)
    if normalize_ar(q) in {normalize_ar(x) for x in LABNEEH_TRIGGER}:
        only_labneeh = [r for r in RECIPES if is_labneeh_kazib(r)]
        if only_labneeh:
            STATE["options"] = only_labneeh
            STATE["last_intent"] = "all"
            return list_names("✅ تم إيجاد لبنية الكزيب فقط، اختاري رقم:", only_labneeh, 80)
        return "غير موجود في مصادري"

    # (C) حلويات
    if qnorm in SWEET_TRIGGER:
        sweets = find_sweets(RECIPES)
        if sweets:
            STATE["options"] = sweets
            STATE["last_intent"] = "all"
            return list_names("✅ تم إيجاد الحلويات/الأطباق الحلوة فقط، اختاري رقم:", sweets, 80)
        return "غير موجود في مصادري"

    # (1) INGREDIENTS FIRST (SUPER STRICT)
    if is_short_term(q):
        ing_hits_with_reason = find_by_ingredient_strict(q, RECIPES)
        if ing_hits_with_reason:
            ing_hits = [r for r, _ in ing_hits_with_reason]
            STATE["options"] = ing_hits
            STATE["last_intent"] = "all"

            if DEBUG_MATCH:
                debug_lines = []
                for r, reason in ing_hits_with_reason[:10]:
                    debug_lines.append(f"- {r.get('name','')}  <= matched ingredient: {reason}")
                dbg = "\n".join(debug_lines)
                return list_names(f"✅ (DEBUG) أكلات تحتوي على ({q}) داخل المكونات فقط:", ing_hits, 80) + "\n\n🔎 أسباب المطابقة (أول 10):\n" + dbg

            return list_names(f"✅ تم إيجاد أكلات تحتوي على ({q}) داخل المكونات/المقادير فقط، اختاري رقم:", ing_hits, 80)

    # (2) KEYWORDS SECOND
    if is_short_term(q):
        kw_hits_with_reason = find_by_keywords_strict(q, RECIPES)
        if kw_hits_with_reason:
            kw_hits = [r for r, _ in kw_hits_with_reason]
            STATE["options"] = kw_hits
            STATE["last_intent"] = "all"

            if DEBUG_MATCH:
                debug_lines = []
                for r, kw in kw_hits_with_reason[:10]:
                    debug_lines.append(f"- {r.get('name','')}  <= keywords: {kw}")
                dbg = "\n".join(debug_lines)
                return list_names(f"✅ (DEBUG) أكلات مرتبطة بالكلمة المفتاحية ({q}):", kw_hits, 80) + "\n\n🔎 من الكلمات المفتاحية (أول 10):\n" + dbg

            return list_names(f"✅ تم إيجاد أكلات مرتبطة بالكلمة المفتاحية ({q})، اختاري رقم:", kw_hits, 80)

    # (3) NAME LAST
    ex = exact_name_hit(q, RECIPES)
    if ex:
        STATE["options"] = None
        return format_recipe(ex, intent)

    name_hits = find_by_name(q, RECIPES)
    if not name_hits:
        name_hits = fuzzy_name_candidates(q, RECIPES)

    if name_hits:
        if len(name_hits) == 1:
            STATE["options"] = None
            return format_recipe(name_hits[0], intent)
        STATE["options"] = name_hits
        STATE["last_intent"] = intent
        return list_names("✅ تم إيجاد أكثر من أكلة مطابقة للاسم، اختاري رقم:", name_hits, 80)

    return "غير موجود في مصادري"
