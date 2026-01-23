import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/welcome.css";
import robotImg from "../assets/a.png";

export default function WelcomePage() {
  const [lang, setLang] = useState(() => localStorage.getItem("df_lang") || "ar");
  const [theme, setTheme] = useState(() => localStorage.getItem("df_theme") || "dark");
  const [modalOpen, setModalOpen] = useState(false);

  const i18n = useMemo(
    () => ({
      ar: {
        dir: "rtl",
        tag: "🍽️ مساعد ظفاري ذكي",
        titleHtml: `توب ذحي في <span class="grad">Dhofar Flavor</span>`,
        desc: `Dhofar Flavor هو شات بوت يجمع لك أكلات ظفارية متنوعة في مكان واحد.
يساعدك تكتشف وصفات شعبية مشهورة، وتتعرف على المكونات وخطوات التحضير بطريقة واضحة وسهلة.
مناسب لمحبي الطبخ واللي يحبون يجربون نكهات ظفار الأصيلة.`,
        f1: "وصفات ظفارية متنوعة ومشهورة",
        f2: "شرح واضح للمكونات وخطوات التحضير",
        f3: "واجهة سهلة + وضع ليلي ونهاري + لغتين",
        start: "ابدأ الآن",
        more: "اعرف أكثر",
        foot: "⚠️ تنبيه: هذا المساعد مخصص لمحتوى الأكلات الظفارية.",
        modalTitle: "عن Dhofar Flavor",
        modalBody: `Dhofar Flavor يقدّم لك محتوى غني عن الأكلات الظفارية: وصفات، مكونات، وطريقة التحضير.
تقدر تسأل باسم الطبق أو تسأل عن المكونات أو الطريقة، وبتحصل شرح مرتب يساعدك تطبخ بثقة.`,
        goChat: "اذهب للشات",
        close: "إغلاق",
        arrow: "←",
      },
      en: {
        dir: "ltr",
        tag: "🍽️ Smart Dhofari Assistant",
        titleHtml: `Welcome to <span class="grad">Dhofar Flavor</span>`,
        desc: `Dhofar Flavor is a chatbot that brings a variety of Dhofari dishes into one place.
Discover popular traditional recipes and learn ingredients and step-by-step cooking in a clear, simple way.
Perfect for home cooks, and anyone who wants to explore authentic Dhofar flavors.`,
        f1: "A variety of popular Dhofari dishes",
        f2: "Clear ingredients and step-by-step cooking",
        f3: "Easy UI + light/dark mode + bilingual",
        start: "Start Now",
        more: "Learn More",
        foot: "⚠️ Note: This assistant focuses on Dhofari food content.",
        modalTitle: "About Dhofar Flavor",
        modalBody: `Dhofar Flavor offers rich Dhofari food content: recipes, ingredients, and cooking steps.
Ask by dish name, ingredients, or method—and get a clean, well-structured answer to help you cook with confidence.`,
        goChat: "Go to Chat",
        close: "Close",
        arrow: "→",
      },
    }),
    []
  );

  const pack = i18n[lang] || i18n.ar;

  // ✅ تطبيق اللغة + الثيم على الـ body / html
  useEffect(() => {
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.documentElement.dir = pack.dir;

    // لا تمسحي كلاسات ثانية بالخطأ
    document.body.classList.add("welcome-body");
    document.body.setAttribute("data-theme", theme);
    document.body.setAttribute("data-lang", lang);

    localStorage.setItem("df_lang", lang);
    localStorage.setItem("df_theme", theme);
  }, [lang, theme, pack.dir]);

  // ✅ ESC يغلق المودال
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ✅ منع سكرول الخلفية وقت فتح المودال
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const year = new Date().getFullYear();

  return (
    <>
      {/* Background */}
      <div className="bg" aria-hidden="true">
        <div className="bg-overlay" />
        <div className="bg-grain" />
      </div>

      {/* Topbar */}
      <header className="topbar">
        <div className="top-left">
          <div className="brand">
            <span className="dot" aria-hidden="true" />
            <span className="brand-name">Dhofar Flavor</span>
          </div>
        </div>

        <div className="top-right">
          <div className="lang-switch" role="tablist" aria-label="Language switch">
            <button
              className={`lang-btn ${lang === "ar" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={lang === "ar"}
              onClick={() => setLang("ar")}
            >
              العربية
            </button>
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={lang === "en"}
              onClick={() => setLang("en")}
            >
              English
            </button>
          </div>

          <button
            className="icon-btn"
            type="button"
            aria-label="Toggle theme"
            title="Theme"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          >
            <span className="theme-ico" aria-hidden="true">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="hero">
        <section className="hero-card">
          {/* RIGHT: ROBOT */}
          <div className="hero-logo">
            <div className="robot-glow" aria-hidden="true" />
            <img src={robotImg} className="robot" alt="Robot" />
          </div>

          {/* LEFT: TEXT */}
          <div className="hero-text">
            <span className="tag">{pack.tag}</span>

            <h1 className="title" dangerouslySetInnerHTML={{ __html: pack.titleHtml }} />

            <p className="desc">{pack.desc}</p>

            <ul className="features">
              <li>
                <span className="check" aria-hidden="true">✔</span>
                <span>{pack.f1}</span>
              </li>
              <li>
                <span className="check" aria-hidden="true">✔</span>
                <span>{pack.f2}</span>
              </li>
              <li>
                <span className="check" aria-hidden="true">✔</span>
                <span>{pack.f3}</span>
              </li>
            </ul>

            <div className="actions">
              <Link to="/chat" className="btn primary">
                <span>{pack.start}</span>
                <span className="arrow" aria-hidden="true">{pack.arrow}</span>
              </Link>

              <button className="btn ghost" type="button" onClick={() => setModalOpen(true)}>
                <span>{pack.more}</span>
              </button>
            </div>

            <div className="foot">{pack.foot}</div>
          </div>
        </section>
      </main>

      {/* Modal */}
      <div
        className={`modal ${modalOpen ? "show" : ""}`}
        aria-hidden={!modalOpen}
        onClick={(e) => {
          // اضغطي خارج البطاقة لإغلاق
          if (e.target.classList.contains("modal")) setModalOpen(false);
        }}
      >
        <div className="modal-card" role="dialog" aria-modal="true" aria-label="About Dhofar Flavor">
          <div className="modal-head">
            <div className="modal-title">{pack.modalTitle}</div>
            <button
              className="icon-btn sm"
              type="button"
              aria-label="Close"
              title="Close"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="modal-body">{pack.modalBody}</div>

          <div className="modal-actions">
            <Link className="btn primary" to="/chat">{pack.goChat}</Link>
            <button className="btn ghost" type="button" onClick={() => setModalOpen(false)}>
              {pack.close}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-copy">© {year} Dhofar Flavor. All rights reserved.</p>
          <p className="footer-by">
            Designed & Developed by <strong>Fatima Al-Amri</strong> & <strong>Noor Fadhil</strong>
          </p>
        </div>
      </footer>
    </>
  );
}
