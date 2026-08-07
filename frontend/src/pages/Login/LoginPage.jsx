import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../../styles/login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/Auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Email veya şifre hatalı.");
    }
  };

  return (
    <div className="login-page">

      <div className="login-left">

        <div className="login-logo">
          🌸
        </div>

        <div className="login-title">
          AskElif
        </div>

        <div className="login-subtitle">
          AI destekli CV Chatbot yönetim paneline hoş geldiniz.

          <br /><br />

          Buradan chatbot bilgisini yönetebilir,
          konuşmaları inceleyebilir ve cevaplanamayan
          soruları kolayca takip edebilirsiniz.

        </div>

      </div>

      <div className="login-right">

        <form
          className="login-card"
          onSubmit={handleLogin}
        >

          <h2>
            Admin Girişi
          </h2>

          <div className="login-group">

            <label>E-Posta</label>

            <input
              className="login-input"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <div className="login-group">

            <label>Şifre</label>

            <input
              className="login-input"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          <button
            className="login-button"
            type="submit"
          >
            Giriş Yap
          </button>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;