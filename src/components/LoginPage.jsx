import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Sparkles, Mail, Lock, LogIn } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

function LoginPage({ setIsAuth, getData }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;

      document.cookie = `hexToken=${token};expires=${new Date(expired)}`;
      axios.defaults.headers.common["Authorization"] = token;
      
      setIsAuth(true);
      
      // If parent passed getData (fetchProducts), call it. But usually AdminLayout does this on mount.
      if (getData) getData(); 

      Swal.fire({
        icon: "success",
        title: "登入成功",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: `請重新輸入帳號密碼!`,
      });
    }
  };

  return (
    <main className="login-page">
      <section className="auth-card">
        <header className="auth-header">
          <h2>
            愛哆啦也愛<span className="text-accent">手作</span>
            <Sparkles color="#ff758c" className="me-2" />
          </h2>
          <p>請輸入你的帳號密碼</p>
        </header>
        <form onSubmit={onSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="username"
              name="username"
              placeholder="name@example.com"
              value={formData.username}
              onChange={handleInputChange}
            />
            <label htmlFor="username">Email address</label>
            <Mail className="input-icon" size={20} />
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <label htmlFor="password">Password</label>
            <Lock className="input-icon" size={20} />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-4 d-flex align-items-center justify-content-center"
          >
            <LogIn size={20} className="me-2" /> 登入
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
