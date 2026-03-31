
import '../components/Form.css'

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

import { useContext } from "react";
import { LanguageContext } from "../assets/LanguageContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { language, setLanguage, translations } = useContext(LanguageContext);
  const t = translations[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginUser(credentials);
      navigate("/booking"); // Redirect to home after successful login
    } catch (error) {
      setError("Invalid email or password");
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="form-container">
      <h2>{t.login.title}</h2>
      {/* <button onClick={() => navigate("/register")}>Create new account</button> */}
      <form onSubmit={handleSubmit}>
        {/* <input type="email" placeholder="Your email" /> */}
        <input
            type="email"
            name="email"
            placeholder="Your email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        {/* <input type="password" placeholder="Password" /> */}
        <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          {error && <div className="error-message">{error}</div>}

        {/* <button type="submit">Log In</button> */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        {t.login.noAccount}{" "}
        <span onClick={() => navigate("/register")} style={{cursor: 'pointer', color:'Green'}}>{t.login.register}</span>
      </p>
    </div>
  );
}
