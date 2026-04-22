import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Header.css";
import UserProfileModal from "./UserProfileModal";
import axios from "axios";
import { LanguageContext } from "../../assets/LanguageContext";
import { API_BASE } from "../../config/api.js";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { language, setLanguage, translations } = useContext(LanguageContext);
  const t = translations[language];

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  const handleProfileClick = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`${API_BASE}/Account/${userId}`);
      setUserData(response.data);
      setShowModal(true);
      setNavOpen(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    setNavOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "isLoggedIn") {
        setIsLoggedIn(e.newValue === "true");
      }
      if (e.key === "theme") {
        const next = e.newValue === "dark" ? "dark" : "light";
        setTheme(next);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [navOpen]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <header className="header">
      <div className="header-inner">
        <div
          className="header-brand"
          onClick={() => {
            navigate("/");
            setNavOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/");
              setNavOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <img
            src="/src/assets/images/BookingSportFildIconApp.png"
            className="header-logo"
            alt=""
          />
          <span className="header-logo-name">{t.header.logoText}</span>
        </div>

        <button
          type="button"
          className={`header-burger ${navOpen ? "is-open" : ""}`}
          aria-expanded={navOpen}
          aria-controls="header-site-nav"
          onClick={() => setNavOpen((o) => !o)}
          aria-label={navOpen ? t.header.menuClose : t.header.menuOpen}
        >
          <span className="header-burger__line" />
          <span className="header-burger__line" />
          <span className="header-burger__line" />
        </button>

        {navOpen && (
          <button
            type="button"
            className="header-backdrop"
            aria-label={t.header.menuClose}
            onClick={() => setNavOpen(false)}
          />
        )}

        <nav
          id="header-site-nav"
          className={`header-site-nav ${navOpen ? "is-open" : ""}`}
        >
          <ul className="header-links">
            <li>
              <a href="/" onClick={() => setNavOpen(false)}>
                {t.header.home}
              </a>
            </li>
            <li>
              <a href="/" onClick={() => setNavOpen(false)}>
                {t.header.contacts}
              </a>
            </li>
          </ul>

          <div className="header-actions">
            <select
              className="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="uk">🇺🇦 Укр</option>
              <option value="en">🇺🇸 Eng</option>
              <option value="pl">🇵🇱 Pl</option>
            </select>

            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? t.theme.switchToLight : t.theme.switchToDark}
              title={theme === "dark" ? t.theme.switchToLight : t.theme.switchToDark}
            >
              {theme === "dark" ? t.theme.light : t.theme.dark}
            </button>

            {isLoggedIn ? (
              <div className="user-menu">
                <button type="button" className="user-menu-button">
                  {t.header.myProfile}
                </button>
                <div className="user-menu-dropdown">
                  <button type="button" onClick={handleProfileClick}>
                    {t.header.profile}
                  </button>
                  <Link
                    className="user-menu-dropdown__link"
                    to="/bookingByUse"
                    onClick={() => setNavOpen(false)}
                  >
                    {t.header.myBookings}
                  </Link>
                  <Link
                    className="user-menu-dropdown__link"
                    to="/booking"
                    onClick={() => setNavOpen(false)}
                  >
                    {t.header.allBookings}
                  </Link>
                  <button type="button" onClick={handleLogout}>
                    {t.header.logout}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    navigate("/login");
                    setNavOpen(false);
                  }}
                >
                  {t.header.loginBtn}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    navigate("/register");
                    setNavOpen(false);
                  }}
                >
                  {t.header.signupBtn}
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {showModal && userData && (
        <UserProfileModal user={userData} onClose={() => setShowModal(false)} />
      )}
    </header>
  );
}
