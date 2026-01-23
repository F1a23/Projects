MODEL_NAME = "llama3"

def safe_rag(msg: str):
    if "rag_answer" not in globals():
        return "RAG غير جاهز. شغّلي خلية (FAISS + rag_answer) أولاً."
    try:
        return rag_answer(msg, model=MODEL_NAME)
    except Exception as e:
        return f"صار خطأ في RAG: {type(e).__name__} — {e}"

def fixed_router_safe(msg: str):
    msg = (msg or "").strip()
    if not msg:
        return "اكتبي مكوّن (لحم/سمك/تمر) أو اسم أكلة أو سؤال."

    if msg.isdigit() and STATE.get("options"):
        idx = int(msg) - 1
        opts = STATE["options"]
        if 0 <= idx < len(opts):
            picked = opts[idx]
            STATE["options"] = None
            return format_recipe(picked)
        return "اختاري رقم صحيح من القائمة."

    if is_short_term(msg):
        term_hits = find_recipes_by_term(msg)
        if term_hits:
            STATE["options"] = term_hits
            out = f"أكلات تحتوي داخل المكونات فقط ({msg}):\n\n"
            for i, r in enumerate(term_hits[:12], 1):
                out += f"{i}) {r['name']} — ({r['id']})\n"
            out += "\nاكتبي رقم الأكلة لعرض التفاصيل."
            return out
        return safe_rag(msg)

    name_hits = find_recipes_by_name(msg)
    if name_hits:
        if len(name_hits) == 1:
            STATE["options"] = None
            return format_recipe(name_hits[0])

        STATE["options"] = name_hits
        out = "لقيت أكثر من أكلة مطابقة للاسم، اختاري رقم:\n\n"
        for i, r in enumerate(name_hits, 1):
            out += f"{i}) {r['name']} — ({r['id']})\n"
        out += "\nاكتبي رقم الأكلة لعرض التفاصيل."
        return out

    return safe_rag(msg)

def chat_fn(message, history):
    return fixed_router_safe(message)
