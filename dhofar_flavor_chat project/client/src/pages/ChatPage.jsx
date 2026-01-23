import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/chat.css";

const API_BASE = "http://127.0.0.1:8000";
const ASK_URL = `${API_BASE}/ask`;

export default function ChatPage() {
  const navigate = useNavigate();
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ keep cursor in input
  const focusInput = () => {
    // تأخير بسيط عشان يتأكد أن العنصر موجود وأنه مو disabled
    setTimeout(() => {
      if (!inputRef.current) return;
      if (inputRef.current.disabled) return;
      inputRef.current.focus({ preventScroll: true });
    }, 0);
  };

  // -----------------------
  // i18n
  // -----------------------
  const I18N = useMemo(
    () => ({
      ar: {
        nav_chat: "المحادثة",
        nav_home: "الرئيسية",
        theme: "الوضع",
        history: "السجل",
        clear: "مسح",
        chat_title: "Dhofar Recipes",
        status_ready: "جاهز",
        status_searching: "يبحث…",
        status_offline: "غير متصل",
        history_title: "سجل المحادثات",
        history_search: "ابحث في السجل...",
        new_chat: "محادثة جديدة",
        delete_chat: "حذف المحادثة",
        clear_all: "مسح كل المحادثات",
        ask_placeholder: "اسأل عن أكلة ظفارية أو اكتب مكوّن مثل: لحم...",
        notice:
          "Dhofar Flavor شات بوت يحتوي على أكلات ظفارية متنوعة ويعرض لك الوصف والمكونات وطريقة التحضير بشكل منظم.",
        help_title: "مساعدة",
        help_1: 'اكتب: "مكونات المضبي" أو "طريقة المعجين"',
        help_2: "اكتب مكوّن (مثل: لحم/سمك/تمر) ليطلع لك أكلات تحتويه",
        help_3: 'جرّبي سؤال طويل مثل: "كيف احضر القبولي؟"',
        close: "إغلاق",
        typing_text: "جاري البحث…",
        cleared_ok: "✅ تم المسح",
        need_question: "اكتب سؤال أولًا 🙂",
        connect_error:
          "تعذر الاتصال بالخادم. تأكدي أن الباكند شغال وأن API_URL صحيح.",
        stopped_ok: "⛔ تم إيقاف البحث",
        deleted_ok: "🗑️ تم حذف المحادثة",
        cleared_all_ok: "🧹 تم مسح كل المحادثات",
        confirm_delete: "هل تريد حذف المحادثة الحالية؟",
        confirm_clear_all: "هل تريد مسح كل المحادثات؟",
        greeting: "مرحبًا 👋 اكتب اسم أكلة أو مكوّن (مثل: لحم) وسأعطيك النتائج.",
        pick_from_list: "اختاري من القائمة:",
      },
      en: {
        nav_chat: "Chat",
        nav_home: "Home",
        theme: "Theme",
        history: "History",
        clear: "Clear",
        chat_title: "Dhofar Recipes",
        status_ready: "Ready",
        status_searching: "Searching…",
        status_offline: "Offline",
        history_title: "Chat History",
        history_search: "Search history...",
        new_chat: "New Chat",
        delete_chat: "Delete chat",
        clear_all: "Clear all chats",
        ask_placeholder:
          "Ask about a Dhofari dish or type an ingredient like: meat...",
        notice:
          "Dhofar Flavor is a chatbot featuring Dhofari dishes, showing description, ingredients, and preparation steps.",
        help_title: "Help",
        help_1: 'Try: "Madbi ingredients" or "How to make Maajin?"',
        help_2: "Type an ingredient (meat/fish/dates) to get dishes containing it",
        help_3: 'Ask a longer question like: "How do I prepare qabooli?"',
        close: "Close",
        typing_text: "Searching…",
        cleared_ok: "✅ Cleared",
        need_question: "Type a question first 🙂",
        connect_error:
          "Could not reach the server. Make sure backend is running and API_URL is correct.",
        stopped_ok: "⛔ Search stopped",
        deleted_ok: "🗑️ Chat deleted",
        cleared_all_ok: "🧹 All chats cleared",
        confirm_delete: "Delete this chat?",
        confirm_clear_all: "Clear all chats?",
        greeting: "Hi 👋 Type a dish name or an ingredient (meat) and I’ll help.",
        pick_from_list: "Pick from the list:",
      },
    }),
    []
  );

  const [lang, setLang] = useState(() => localStorage.getItem("df_lang") || "ar");
  const [theme, setTheme] = useState(() => localStorage.getItem("df_theme") || "dark");
  const t = (key) => (I18N[lang] && I18N[lang][key] ? I18N[lang][key] : key);

  // -----------------------
  // UI state
  // -----------------------
  const [historyOpen, setHistoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [apiMode, setApiMode] = useState("ready"); // ready | busy | offline
  const [hintText, setHintText] = useState("");
  const [searchText, setSearchText] = useState("");

  // -----------------------
  // Chat state (localStorage)
  // -----------------------
  const STORAGE_KEY = "df_chat_state_v5";

  const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);
  const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { groups: [], activeId: null };
  });

  const activeGroup = state.groups?.find((g) => g.id === state.activeId);

  // ✅ IMPORTANT: functional save to avoid losing messages
  const saveState = (updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const ensureGroup = () => {
    saveState((prev) => {
      if (prev.groups?.length) return prev;
      const id = uid();
      return { groups: [{ id, title: t("chat_title"), messages: [] }], activeId: id };
    });
  };

  // -----------------------
  // Abort controller (Stop)
  // -----------------------
  const controllerRef = useRef(null);

  // -----------------------
  // effects: apply lang/dir + theme
  // -----------------------
  useEffect(() => {
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.setAttribute("data-lang", lang);
    localStorage.setItem("df_lang", lang);
    // ✅ keep focus after switching language
    focusInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
  const root = document.documentElement; // <html>

  root.classList.toggle("theme-light", theme === "light");
  root.classList.toggle("theme-dark", theme !== "light");

  localStorage.setItem("df_theme", theme);
  focusInput();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [theme]);


  useEffect(() => {
    ensureGroup();
    // ✅ focus once on mount
    focusInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ ESC يغلق المودالات + الهستوري
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setHelpOpen(false);
        setHistoryOpen(false);
        // ✅ رجّع المؤشر للبوكس
        focusInput();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ لما ينغلق/ينفتح الهستوري أو المساعدة رجّع الفوكس للبوكس
  useEffect(() => {
    if (!helpOpen && !historyOpen) focusInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helpOpen, historyOpen]);

  // ✅ لما يرجع جاهز بعد الرد رجّع الفوكس
  useEffect(() => {
    if (apiMode === "ready") focusInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiMode]);

  // greeting if empty (مرة واحدة)
  useEffect(() => {
    if (!activeGroup) return;
    if (!Array.isArray(activeGroup.messages)) return;

    if (activeGroup.messages.length === 0) {
      saveState((prev) => {
        const next = structuredClone(prev);
        const g = next.groups.find((x) => x.id === next.activeId);
        if (!g) return prev;
        if (g.messages.length === 0) {
          g.messages.push({
            id: uid(),
            role: "bot",
            text: t("greeting"),
            time: nowTime(),
            typing: false,
          });
        }
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeId]);

  // scroll bottom
  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [state.activeId, activeGroup?.messages?.length]);

  // helper hint
  const hint = (text, ms = 1200) => {
    setHintText(text || "");
    if (!text) return;
    setTimeout(() => setHintText((cur) => (cur === text ? "" : cur)), ms);
  };

  // -----------------------
  // actions
  // -----------------------
  const createGroup = () => {
    const id = uid();
    saveState((prev) => {
      const next = structuredClone(prev);
      next.groups.unshift({ id, title: t("chat_title"), messages: [] });
      next.activeId = id;
      return next;
    });
    hint(t("new_chat"));
    // ✅ رجّع المؤشر للبوكس
    focusInput();
  };

  const setActive = (id) => {
    saveState((prev) => ({ ...prev, activeId: id }));
    // ✅ رجّع المؤشر للبوكس
    focusInput();
  };

  const addMessage = (role, text, extra = {}) => {
    saveState((prev) => {
      const next = structuredClone(prev);
      const g = next.groups.find((x) => x.id === next.activeId);
      if (!g) return prev;

      g.messages.push({
        id: uid(),
        role,
        text,
        time: nowTime(),
        typing: !!extra.typing,
      });

      const firstUser = g.messages.find((m) => m.role === "user");
      g.title = firstUser
        ? firstUser.text.slice(0, 20) + (firstUser.text.length > 20 ? "…" : "")
        : t("chat_title");

      return next;
    });
  };

  const patchLastBotMessage = (patch = {}) => {
    saveState((prev) => {
      const next = structuredClone(prev);
      const g = next.groups.find((x) => x.id === next.activeId);
      if (!g || !g.messages?.length) return prev;

      for (let i = g.messages.length - 1; i >= 0; i--) {
        if (g.messages[i].role === "bot") {
          g.messages[i] = { ...g.messages[i], ...patch };
          break;
        }
      }
      return next;
    });
  };

  const clearChatMessages = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setApiMode("ready");
    }
    saveState((prev) => {
      const next = structuredClone(prev);
      const g = next.groups.find((x) => x.id === next.activeId);
      if (!g) return prev;
      g.messages = [];
      return next;
    });
    hint(t("cleared_ok"));
    // ✅ رجّع المؤشر للبوكس
    focusInput();
  };

  const deleteActiveChat = () => {
    const ok = window.confirm(t("confirm_delete"));
    if (!ok) return;

    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setApiMode("ready");
    }

    saveState((prev) => {
      const next = structuredClone(prev);
      const idx = next.groups.findIndex((x) => x.id === next.activeId);
      if (idx >= 0) next.groups.splice(idx, 1);

      if (!next.groups.length) {
        const id = uid();
        next.groups = [{ id, title: t("chat_title"), messages: [] }];
        next.activeId = id;
      } else {
        next.activeId = next.groups[0].id;
      }
      return next;
    });

    hint(t("deleted_ok"));
    // ✅ رجّع المؤشر للبوكس
    focusInput();
  };

  const clearAllChats = () => {
    const ok = window.confirm(t("confirm_clear_all"));
    if (!ok) return;

    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setApiMode("ready");
    }

    const id = uid();
    saveState({ groups: [{ id, title: t("chat_title"), messages: [] }], activeId: id });
    hint(t("cleared_all_ok"));
    // ✅ رجّع المؤشر للبوكس
    focusInput();
  };

  // -----------------------
  // Parse numbered list
  // -----------------------
  const parseOptionsFromBotText = (text) => {
    if (!text || typeof text !== "string") return null;

    const hasPrompt =
      text.includes("اكتبي رقم") ||
      text.includes("اختاري رقم") ||
      text.toLowerCase().includes("pick") ||
      text.includes("✍️");

    if (!hasPrompt) return null;

    const lines = text.split("\n").map((l) => l.trim());
    const items = [];

    for (const line of lines) {
      const m = line.match(/^(\d+)\)\s*(.+)$/);
      if (m) items.push({ num: m[1], label: m[2] });
    }
    if (!items.length) return null;
    return items.slice(0, 12);
  };

  // -----------------------
  // API (normal ask)
  // -----------------------
  const askAPI = async (question) => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const res = await fetch(ASK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    controllerRef.current = null;

    const answer =
      typeof data.answer === "string" && data.answer.trim()
        ? data.answer.trim()
        : typeof data.response === "string" && data.response.trim()
        ? data.response.trim()
        : typeof data.text === "string" && data.text.trim()
        ? data.text.trim()
        : JSON.stringify(data);

    return answer;
  };

  const stopSearch = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setApiMode("ready");
      setTyping(false);
      patchLastBotMessage({ typing: false });
      hint(t("stopped_ok"));
      // ✅ رجّع المؤشر للبوكس
      focusInput();
    } else {
      hint(t("stopped_ok"));
      focusInput();
    }
  };

  // typing bubble
  const [typing, setTyping] = useState(false);

  // -----------------------
  // Typewriter (SAFE)
  // -----------------------
  const typeTimerRef = useRef(null);

  const runTypewriterForLastBot = (fullText, speed = 10) => {
    if (typeTimerRef.current) {
      clearInterval(typeTimerRef.current);
      typeTimerRef.current = null;
    }

    let i = 0;
    patchLastBotMessage({ text: "", typing: true });

    typeTimerRef.current = setInterval(() => {
      i += 1;
      patchLastBotMessage({ text: fullText.slice(0, i), typing: true });

      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }

      if (i >= fullText.length) {
        clearInterval(typeTimerRef.current);
        typeTimerRef.current = null;
        patchLastBotMessage({ typing: false });
        // ✅ بعد ما يخلص كتابة الرد رجّع المؤشر للبوكس
        focusInput();
      }
    }, speed);
  };

  // -----------------------
  // SEND (normal only)
  // -----------------------
  const onSend = async (text) => {
    const q = (text || "").trim();
    if (!q) return hint(t("need_question"));
    if (apiMode === "busy") return;

    addMessage("user", q);

    setApiMode("busy");
    setTyping(true);

    addMessage("bot", "", { typing: true });

    try {
      const answer = await askAPI(q);

      setTyping(false);
      setApiMode("ready");
      runTypewriterForLastBot(answer, 10);

      // ✅ بعد الإرسال مباشرة رجّع المؤشر للبوكس
      focusInput();
    } catch (e) {
      setTyping(false);
      if (e.name === "AbortError") {
        setApiMode("ready");
        focusInput();
        return;
      }
      setApiMode("offline");
      patchLastBotMessage({ text: t("connect_error"), typing: false });
      focusInput();
    } finally {
      controllerRef.current = null;
    }
  };

  // input
  const [msg, setMsg] = useState("");

  // filtered history list
  const filteredGroups = (state.groups || []).filter((g) => {
    const q = (searchText || "").trim().toLowerCase();
    if (!q) return true;
    const title = (g.title || "").toLowerCase();
    const last = (g.messages?.[g.messages.length - 1]?.text || "").toLowerCase();
    return title.includes(q) || last.includes(q);
  });

  const year = new Date().getFullYear();
  const apiDotClass =
    apiMode === "busy" ? "dot busy" : apiMode === "offline" ? "dot offline" : "dot";

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="traffic" aria-hidden="true">
            <span className="t green"></span>
            <span className="t yellow"></span>
            <span className="t red"></span>
          </div>
          <div className="brand-title">
            <div className="name">Dhofar Flavor</div>
            <div className="sub">Chatbot</div>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-item active" type="button">
            <span className="icon" aria-hidden="true">💬</span>
            <span className="label">{t("nav_chat")}</span>
          </button>

          <button className="nav-item" type="button" onClick={() => navigate("/")}>
            <span className="icon" aria-hidden="true">🏠</span>
            <span className="label">{t("nav_home")}</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="theme-btn"
            type="button"
            title="Theme"
            onClick={() => setTheme((x) => (x === "light" ? "dark" : "light"))}
          >
            <span aria-hidden="true">{theme === "light" ? "☀️" : "🌙"}</span>
            <span className="label">{t("theme")}</span>
          </button>

          <div className="profile">
            <div className="avatar">D</div>
            <div className="meta">
              <div className="pname">Dhofar Flavor</div>
              <div className="pmail">local@chatbot</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="top-left">
            <button
              className="chip"
              type="button"
              title="History"
              onClick={() => {
                setHistoryOpen((v) => !v);
                // ✅ رجّع الفوكس لو قفلتي
                setTimeout(() => {
                  if (!historyOpen) return; // كان مفتوح وصار يقفل
                  focusInput();
                }, 0);
              }}
            >
              <span aria-hidden="true">{historyOpen ? "❯" : "❮"}</span>
              <span>{t("history")}</span>
            </button>

            <button className="chip" type="button" title="Clear" onClick={clearChatMessages}>
              <span aria-hidden="true">🧹</span>
              <span>{t("clear")}</span>
            </button>

            <button className="chip" type="button" title="Help" onClick={() => setHelpOpen(true)}>
              <span aria-hidden="true">❔</span>
              <span>{t("help_title")}</span>
            </button>
          </div>

          <div className="top-center">
            <div className="chat-title">{activeGroup?.title || t("chat_title")}</div>
            <div className="status">
              <span className={apiDotClass} aria-hidden="true"></span>
              <span>
                {apiMode === "busy"
                  ? t("status_searching")
                  : apiMode === "offline"
                  ? t("status_offline")
                  : t("status_ready")}
              </span>
            </div>
          </div>

          <div className="top-right">
            <div className="lang-switch" role="tablist" aria-label="Language">
              <button className={`lang-btn ${lang === "ar" ? "active" : ""}`} type="button" onClick={() => setLang("ar")}>
                العربية
              </button>
              <button className={`lang-btn ${lang === "en" ? "active" : ""}`} type="button" onClick={() => setLang("en")}>
                English
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className={`content ${historyOpen ? "history-open" : ""}`}>
          {/* HISTORY DRAWER */}
          <section className="history" aria-label="History">
            <div className="history-head">
              <div className="h-title">{t("history_title")}</div>
              <div className="pill">{String(state.groups?.length || 0)}</div>
            </div>

            <div className="history-actions">
              <input
                type="text"
                placeholder={t("history_search")}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <button className="btn-outline" type="button" onClick={createGroup}>
                <span aria-hidden="true">＋</span>
                <span>{t("new_chat")}</span>
              </button>

              <button className="btn-outline" type="button" onClick={deleteActiveChat}>
                <span aria-hidden="true">🗑️</span>
                <span>{t("delete_chat")}</span>
              </button>

              <button className="btn-outline" type="button" onClick={clearAllChats}>
                <span aria-hidden="true">🧹</span>
                <span>{t("clear_all")}</span>
              </button>
            </div>

            <div className="history-list">
              {filteredGroups.map((g) => {
                const lastMsg = g.messages?.[g.messages.length - 1]?.text || "";
                const lastTime = g.messages?.[g.messages.length - 1]?.time || "";

                return (
                  <div
                    key={g.id}
                    className={`group ${g.id === state.activeId ? "active" : ""}`}
                    onClick={() => setActive(g.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setActive(g.id);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="group-top">
                      <div className="group-title">{g.title}</div>
                      <div className="group-time">{lastTime}</div>
                    </div>
                    <div className="group-snippet">
                      {lastMsg.slice(0, 70)}
                      {lastMsg.length > 70 ? "…" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CHAT PANEL */}
          <section className="chat">
            <div className="notice">{t("notice")}</div>

            <div className="messages" id="messages" ref={messagesRef}>
              {(activeGroup?.messages || []).map((m, idx) => {
                const options = m.role === "bot" ? parseOptionsFromBotText(m.text) : null;

                return (
                  <div key={m.id || idx} className={`msg-wrap ${m.role === "user" ? "user" : "bot"}`}>
                    <div className={`msg ${m.role === "user" ? "user" : "bot"}`}>
                      <div className="msg-text">{m.text}</div>
                      <div className="msg-time-in">{m.time}</div>
                      {m.role === "bot" && m.typing ? (
                        <span className="type-cursor" aria-hidden="true">▍</span>
                      ) : null}
                    </div>

                    {m.role === "bot" && options && !m.typing ? (
                      <div className="pickbar">
                        <div className="pick-title">{t("pick_from_list")}</div>
                        <div className="pick-buttons">
                          {options.map((opt) => (
                            <button
                              key={opt.num}
                              type="button"
                              className="btn-outline"
                              disabled={apiMode === "busy"}
                              onClick={() => onSend(opt.num)}
                              title={opt.label}
                            >
                              {opt.num}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {typing && (
                <div className="msg-wrap bot">
                  <div className="msg bot">
                    <span className="typing" aria-hidden="true">
                      <span className="b"></span><span className="b"></span><span className="b"></span>
                    </span>
                    <span style={{ marginInlineStart: 10 }}>{t("typing_text")}</span>
                    <div className="msg-time-in">{nowTime()}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="composer">
              <div className="input-row">
                <input
                  ref={inputRef}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const v = msg;
                      if (!v.trim()) return hint(t("need_question"));
                      if (apiMode === "busy") return;
                      setMsg("");
                      onSend(v);
                      // ✅ رجّع المؤشر للبوكس بعد الإرسال
                      focusInput();
                    }
                  }}
                  disabled={apiMode === "busy"}
                  type="text"
                  placeholder={t("ask_placeholder")}
                />

                <div className="actions">
                  <button
                    className={`stop ${apiMode === "busy" ? "" : "hidden"}`}
                    type="button"
                    aria-label="Stop"
                    onClick={stopSearch}
                    title="Stop"
                  >
                    ⛔
                  </button>

                  <button
                    className="send"
                    type="button"
                    aria-label="Send"
                    disabled={apiMode === "busy"}
                    onClick={() => {
                      const v = msg;
                      if (!v.trim()) return hint(t("need_question"));
                      if (apiMode === "busy") return;
                      setMsg("");
                      onSend(v);
                      // ✅ رجّع المؤشر للبوكس بعد الإرسال
                      focusInput();
                    }}
                    title="Send"
                  >
                    ➤
                  </button>
                </div>
              </div>

              <div className="hint">{hintText}</div>
            </div>

            <footer className="site-footer">
              <div className="footer-inner">
                <p className="footer-copy">© {year} Dhofar Flavor. All rights reserved.</p>
                <p className="footer-by">
                  Designed & Developed by <strong>Fatima Al-Amri</strong> &{" "}
                  <strong>Noor Fadhil</strong>
                </p>
              </div>
            </footer>
          </section>
        </div>
      </main>

      {/* Help Modal */}
      <div
        className={`modal ${helpOpen ? "show" : ""}`}
        aria-hidden={!helpOpen}
        onClick={(e) => {
          if (e.target.classList.contains("modal")) {
            setHelpOpen(false);
            // ✅ بعد الإغلاق رجّع المؤشر للبوكس
            focusInput();
          }
        }}
      >
        <div className="modal-card" role="dialog" aria-modal="true">
          <div className="modal-head">
            <div className="modal-title">{t("help_title")}</div>
            <button
              className="chip"
              type="button"
              onClick={() => {
                setHelpOpen(false);
                // ✅ بعد الإغلاق رجّع المؤشر للبوكس
                focusInput();
              }}
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            <ul className="help-list">
              <li>{t("help_1")}</li>
              <li>{t("help_2")}</li>
              <li>{t("help_3")}</li>
            </ul>
          </div>

          <div className="modal-actions">
            <button
              className="btn-outline"
              type="button"
              onClick={() => {
                setHelpOpen(false);
                // ✅ بعد الإغلاق رجّع المؤشر للبوكس
                focusInput();
              }}
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
