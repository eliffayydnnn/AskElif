import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

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
  console.log(error.response);
  console.log(error.response?.data);

  alert("Email veya şifre hatalı.");
}
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "380px",
          background: "#fff",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          AskElif Admin
        </h2>

        <div style={{ marginBottom: "15px" }}>
          <label>E-Posta</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label>Şifre</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default LoginPage;