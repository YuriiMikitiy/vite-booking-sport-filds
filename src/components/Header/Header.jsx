import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import UserProfileModal from "./UserProfileModal";
import axios from "axios";
import { LanguageContext } from "../../assets/LanguageContext";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  
  const { language, setLanguage, translations } = useContext(LanguageContext);
  const t = translations[language];

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
  });

  const handleProfileClick = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`https://localhost:44313/api/Account/${userId}`);
      setUserData(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn') {
        setIsLoggedIn(e.newValue === 'true');
      }
      if (e.key === "theme") {
        const next = e.newValue === "dark" ? "dark" : "light";
        setTheme(next);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className="header">
      <img
        src="/src/assets/images/BookingSportFildIconApp.png"
        className="header-logo"
        alt="Logo"
        onClick={() => navigate("/")}
        style={{ cursor: 'pointer' }}
      />

      <ul className="nav-list">
        <li className="header-logo-name">{t.header.logoText}</li>
        <li>
          <a href="/">{t.header.home}</a>
        </li>
        <li>
          <a href="/">{t.header.contacts}</a>
        </li>

        {/* Тепер select перенесено в buttonSection нижче */}

        <div className="buttonSection">
          {/* Вибір мови тепер тут, поруч із кнопкою теми */}
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
              <button className="user-menu-button">
                {t.header.myProfile}
              </button>
              <div className="user-menu-dropdown">
                <button onClick={handleProfileClick}>{t.header.profile}</button>
                <button onClick={() => navigate("/bookingByUse")}>{t.header.myBookings}</button>
                <button onClick={() => navigate("/booking")}>{t.header.allBookings}</button>
                <button onClick={handleLogout}>{t.header.logout}</button>
              </div>
            </div>
          ) : (
            <>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                {t.header.loginBtn}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/register")}
              >
                {t.header.signupBtn}
              </button>
            </>
          )}
        </div>
      </ul>

      {showModal && userData && (
        <UserProfileModal user={userData} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}