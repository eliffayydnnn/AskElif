import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function CreateKnowledgePage() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/Knowledge",
        {
          question,
          answer,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Bilgi başarıyla eklendi.");

      navigate("/knowledge");
    } catch (error) {
  console.log(error);
  console.log(error.response);
  console.log(error.response?.data);

  alert("Bir hata oluştu.");
}
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1>Yeni Bilgi Ekle</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label>Soru</label>

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Cevap</label>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows="6"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label>Kategori</label>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 24px",
            background: "#E88AB2",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}

export default CreateKnowledgePage;