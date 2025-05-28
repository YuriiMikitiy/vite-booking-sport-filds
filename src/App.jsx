import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import BookingPage from "./components/BookingPage/BookingPage";
import HomePage from "./components/HomaPage/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import BookingPageUser from "./components/BookingPageUser/BookingPageUser";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <Router>
      <div style={{ margin: 0, padding: 0 }}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/bookingByUse" element={<BookingPageUser />} />
          </Routes>
        </main>
        {/* <Footer/> */}
      </div>
    </Router>
  );
}

export default App;
