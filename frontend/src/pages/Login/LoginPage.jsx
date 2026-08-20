import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/api";
import "../../styles/login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || loading) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/Auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      toast.success("Giriş başarılı.");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Email veya şifre hatalı.");
      alert("Email veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* SOL TARAF */}

      <div className="login-left">

        <div className="login-brand">

          <div className="login-logo">
            🌸
          </div>

          <div>
            <div className="login-brand-name">
              AskElif
            </div>

            <div className="login-brand-subtitle">
              AI CV Assistant
            </div>
          </div>

        </div>

        <div className="login-welcome">

          <div className="login-eyebrow">
            ADMIN PANEL
          </div>

          <h1>
            AskElif'e
            <br />
            hoş geldin. 👋
          </h1>

          <p>
            AI destekli CV chatbot yönetim panelinden
            chatbot bilgisini yönetebilir, konuşmaları
            inceleyebilir ve cevaplanamayan soruları
            takip edebilirsin.
          </p>

        </div>

        <div className="login-decoration decoration-one"></div>
        <div className="login-decoration decoration-two"></div>
        <div className="login-decoration decoration-three"></div>

      </div>


      {/* SAĞ TARAF */}

      <div className="login-right">

        <form
          className="login-card"
          onSubmit={handleLogin}
        >

          <div className="login-card-header">

            <div className="login-card-icon">
              🔐
            </div>

            <div>
              <h2>
                Admin Girişi
              </h2>

              <p>
                Yönetim paneline devam etmek için
                giriş yapın.
              </p>
            </div>

          </div>


          {/* EMAIL */}

          <div className="login-group">

            <label htmlFor="email">
              E-Posta
            </label>

            <div className="login-input-wrapper">

              <Mail size={18} />

              <input
                id="email"
                className="login-input"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div className="login-group">

            <label htmlFor="password">
              Şifre
            </label>

            <div className="login-input-wrapper">

              <Lock size={18} />

              <input
                id="password"
                className="login-input"
                type="password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* BUTTON */}

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            <span>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </span>

            <ArrowRight size={18} />

          </button>


          <div className="login-footer">
            AskElif Admin Panel
          </div>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;