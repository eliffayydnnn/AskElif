import { useEffect, useState } from "react";
import api from "../../api/api";

function UnknownQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const filtered = questions.filter((item) =>
      item.question.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredQuestions(filtered);
  }, [search, questions]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/UnknownQuestions");

      setQuestions(response.data);
      setFilteredQuestions(response.data);
    } catch (error) {
      console.log(error);
      alert("Sorular yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    if (!window.confirm("Bu soruyu çözüldü olarak işaretlemek istiyor musunuz?"))
      return;

    try {
      await api.put(`/UnknownQuestions/${id}/resolve`);

      setQuestions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isResolved: true } : item
        )
      );

      alert("Soru çözüldü olarak işaretlendi.");
    } catch (error) {
      console.log(error);
      alert("İşlem başarısız.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu soruyu silmek istiyor musunuz?")) return;

    try {
      await api.delete(`/UnknownQuestions/${id}`);

      setQuestions((prev) => prev.filter((item) => item.id !== id));

      alert("Soru silindi.");
    } catch (error) {
      console.log(error);
      alert("Silinemedi.");
    }
  };

  if (loading) {
    return <h2>Yükleniyor...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Unknown Questions</h1>

      <input
        type="text"
        placeholder="Soru ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          margin: "25px 0",
        }}
      />

      {filteredQuestions.length === 0 ? (
        <p>Gösterilecek soru bulunamadı.</p>
      ) : (
        filteredQuestions.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h3>{item.question}</h3>

            <p>
              <strong>Tarih:</strong>{" "}
              {new Date(item.askedAt).toLocaleString("tr-TR")}
            </p>

            <p>
              <strong>Durum:</strong>{" "}
              {item.isResolved ? "✅ Çözüldü" : "❌ Bekliyor"}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {!item.isResolved && (
                <button
                  onClick={() => handleResolve(item.id)}
                  style={{
                    background: "#22C55E",
                    color: "#fff",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Çözüldü
                </button>
              )}

              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  background: "#EF4444",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Sil
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UnknownQuestionsPage;