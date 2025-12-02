import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // هذا أكيد عندك
import "bootstrap/dist/js/bootstrap.bundle.min"; // هذا يشغل الهامبرغر والقوائم
import { FaUserCircle } from "react-icons/fa";

import "./styles.css";

const Header = () => {
  const [language, setLanguage] = useState("en"); // حالة اللغة
  const [darkMode, setDarkMode] = useState(false); // حالة الوضع الداكن

  // النصوص باللغتين
  const translations = {
    en: {
      brand: "University Clinic",
      home: "Home",
      about: "About Us",
      feedback: "Feedback & Reviews",
      services: "Services",
      directHealth: "Direct Health Services",
      appointment: "Appointment Scheduling",
      education: "Health Education & Awareness",
      communication: "Communication & Support",
      mentalHealth: "Mental Health Services",
      medication: "Medication Management",
      contact: "Contact Us",
      logout: "Logout",
      search: "Search",
      toggleTheme: "Toggle Theme",
      toggleLang: "عربي",
    },
    ar: {
      brand: "العيادة الجامعية",
      home: "الرئيسية",
      about: "معلومات عنا",
      feedback: "التقييمات والمراجعات",
      services: "الخدمات",
      directHealth: "الخدمات الصحية المباشرة",
      appointment: "جدولة المواعيد",
      education: "التثقيف والتوعية الصحية",
      communication: "التواصل والدعم",
      mentalHealth: "خدمات الصحة النفسية",
      medication: "إدارة الأدوية",
      contact: "اتصل بنا",
      logout: "تسجيل الخروج",
      search: "بحث",
      toggleTheme: "تبديل الوضع",
      toggleLang: "English",
    },
  };

  // تبديل اللغة
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "ar" : "en"));
  };

  // تبديل الوضع الداكن
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // تطبيق الوضع الداكن أو الفاتح على الـ body عند التغيير
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-white");
    } else {
      document.body.classList.remove("bg-dark", "text-white");
    }
  }, [darkMode]);

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "bg-body-tertiary"
      }`}
    >
      <div className="container-fluid">
        {/* تم إزالة رابط الصفحة هنا */}
        <span className="navbar-brand">{translations[language].brand}</span>
        <img src="logo.png" alt="logo" className="logo" />

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                {translations[language].home}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                {translations[language].about}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/feedback">
                {translations[language].feedback}
              </Link>
            </li>

            {/* قائمة الخدمات Services */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="/services"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {translations[language].services}
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/direct">
                    {translations[language].directHealth}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/appointment">
                    {translations[language].appointment}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/education">
                    {translations[language].education}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/communication">
                    {translations[language].communication}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/mental">
                    {translations[language].mentalHealth}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/medication">
                    {translations[language].medication}
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                {translations[language].contact}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/logout">
                {translations[language].logout}
              </Link>
            </li>
          </ul>

          <form className="search btn d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder={translations[language].search}
              aria-label="Search"
            />
            <button className="search btn btn-outline-success" type="submit">
              {translations[language].search}
            </button>
          </form>

          {/* زر تغيير الوضع (فاتح/داكن) */}
          <button
            className=" bb btn theme-toggle ms-2"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <FaSun className="sun-icon" />
            ) : (
              <FaMoon className="moon-icon" />
            )}
          </button>

          {/* زر تغيير اللغة */}
          <button className="bb btn btn-primary ms-2" onClick={toggleLanguage}>
            {translations[language].toggleLang}
          </button>
          <Link
            to="/profile"
            className="btn btn-outline-secondary ms-2"
            title="الملف الشخصي"
          >
            <FaUserCircle size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
