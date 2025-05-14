import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (error) {
      try {
        const errorObj = JSON.parse(error.message);
        setErrors(errorObj);
      } catch {
        setErrors({ general: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create account</h2>
      {/* <button onClick={() => navigate("/login")}>Sign in</button> */}
      <form onSubmit={handleSubmit}>
        {/* <input type="email" placeholder="Your email" /> */}
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.Email && <span className="error">{errors.Email}</span>}
        {/* <input type="text" placeholder="Full name" /> */}
        <input
          type="text"
          name="fullName"
          placeholder="Full name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        {errors.FullName && <span className="error">{errors.FullName}</span>}
        {/* <input type="password" placeholder="Password" /> */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.Password && <span className="error">{errors.Password}</span>}
        {/* <input type="text" placeholder="Phone number" /> */}
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          placeholder="Format: +380XXXXXXXXX"
        />
        {errors.PhoneNumber && (
          <span className="error">{errors.PhoneNumber}</span>
        )}

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        {/* <button type="submit">Create account</button> */}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} style={{cursor: 'pointer', color:'Green'}}>Login</span>
      </p>
    </div>
  );
}
