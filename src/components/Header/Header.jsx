import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import UserProfileModal from "./UserProfileModal";
import axios from "axios";

export default function Header() {
  // const [language, setLanguage] = useState("uk");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Ініціалізуємо стан з localStorage
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();


  // const handleLanguageChange = (lang) => {
  //   setLanguage(lang);
  // };

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
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    navigate("/");
  };

  // Додамо обробник подій для синхронізації між вкладками
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn') {
        setIsLoggedIn(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="header">
      <img
        src="/src/assets/images/BookingSportFildIconApp.png"
        className="header-logo"
        alt="Головна"
      />

      <ul className="nav-list">
        <li className="header-logo-name">mikitchTask</li>
        <li>
          <a href="/">Головна сторінка</a>
        </li>
        <li>
          <a href="/">Контакти</a>
        </li>
        {/* <li>
          <select
            style={{
              backgroundColor: '#55787e',
              color: 'black',
            }}
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="uk">Укр</option>
            <option value="en">Eng</option>
            <option value="fr">Fr</option>
          </select>
        </li> */}
        <div className="buttonSection">
          {isLoggedIn ? (
            <div className="user-menu">
              <button className="user-menu-button">
                Мій профіль ▼
              </button>
              <div className="user-menu-dropdown">
                <button onClick={handleProfileClick}>Профіль</button>
                <button onClick={() => navigate("/bookingByUse")}>Мої бронювання</button>
                <button onClick={() => navigate("/booking")}>Всі бронювання</button>
                <button onClick={handleLogout}>Вийти</button>
                {/* Додайте інші пункти меню за необхідності */}
              </div>
            </div>
          ) : (
            <>
              <button
                style={{
                  border: "1px solid #000",
                  borderRadius: "7px",
                  padding: "8px 20px",
                  width: "90px",
                  height: "40px",
                  background: "#7fa200",
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "150%",
                  color: "#000",
                }}
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                style={{
                  border: "2px solid #af52de",
                  borderRadius: "7px",
                  padding: "8px 20px",
                  width: "156px",
                  height: "40px",
                  background: "#000",
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "150%",
                  color: "#fff",
                }}
                onClick={() => navigate("/register")}
              >
                Started for free
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

