import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import LoginPage from "./components/LoginPage";
import AdminLayout from "./components/AdminLayout";

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const checkLogin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "驗證失敗!",
        text: `請重新登入!${error.response?.data?.message || ""}`,
      });
      setIsAuth(false);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    setIsAuthLoading(true);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      checkLogin();
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  if (isAuthLoading) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center align-items-center flex-column vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div>頁面重載中，請稍候...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuth ? (
        <AdminLayout setIsAuth={setIsAuth} />
      ) : (
        <LoginPage setIsAuth={setIsAuth} />
      )}
    </>
  );
}

export default App;
