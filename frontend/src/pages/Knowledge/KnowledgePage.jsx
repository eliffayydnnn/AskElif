import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function KnowledgePage() {
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Bu bilgiyi silmek istediğinize emin misiniz?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await api.delete(`/Knowledge/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setKnowledgeList((prev) =>
      prev.filter((item) => item.id !== id)
    );

    alert("Bilgi silindi.");
  } catch (error) {
    console.log(error);
    alert("Silme işlemi başarısız.");
  }
};
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/Knowledge", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setKnowledgeList(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

  if (loading) {
    return <h2>Yükleniyor...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1>Knowledge</h1>

        <Link
          to="/knowledge/create"
          style={{
            padding: "12px 20px",
            background: "#E88AB2",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          + Yeni Bilgi Ekle
        </Link>
      </div>

      <input
        type="text"
        placeholder="Bilgi ara..."
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "30px",
          boxSizing: "border-box",
        }}
      />

      {knowledgeList.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
            background: "#fff",
          }}
        >
          <h3>{item.question}</h3>

          <p>{item.answer}</p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Link
              to={`/knowledge/edit/${item.id}`}
              style={{
                background: "#4F8EF7",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Düzenle
            </Link>

<button
  onClick={() => handleDelete(item.id)}
  style={{
    background: "#EF4444",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Sil
</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KnowledgePage;