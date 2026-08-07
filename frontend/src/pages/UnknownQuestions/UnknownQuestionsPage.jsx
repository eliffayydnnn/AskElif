import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/unknownQuestions.css";

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
    if (
      !window.confirm(
        "Bu soruyu çözüldü olarak işaretlemek istiyor musunuz?"
      )
    )
      return;

    try {
      await api.put(`/UnknownQuestions/${id}/resolve`);

      setQuestions((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isResolved: true }
            : item
        )
      );
    } catch (error) {
      console.log(error);
      alert("İşlem başarısız.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu soruyu silmek istiyor musunuz?"))
      return;

    try {
      await api.delete(`/UnknownQuestions/${id}`);

      setQuestions((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.log(error);
      alert("Silinemedi.");
    }
  };

  if (loading) {
    return <h2>Yükleniyor...</h2>;
  }

  return (
    <div className="unknown-page">

      <div className="unknown-header">

        <div>

          <div className="unknown-title">
            ❓ Unknown Questions
          </div>

          <div className="unknown-subtitle">
            Chatbot'un cevaplayamadığı soruları buradan takip edebilirsin.
          </div>

        </div>

      </div>

      <input
        className="conversation-search"
        placeholder="🔍 Soru ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredQuestions.length === 0 ? (

        <div className="empty-state">
          Gösterilecek soru bulunamadı.
        </div>

      ) : (

        filteredQuestions.map((item) => (

          <div
            key={item.id}
            className="question-card"
          >

            <div className="question-top">

              <div>

                <div className="question-text">
                  {item.question}
                </div>

                <div className="question-date">
                  {new Date(
                    item.askedAt
                  ).toLocaleString("tr-TR")}
                </div>

              </div>

              <div
                className={`status ${
                  item.isResolved
                    ? "done"
                    : "pending"
                }`}
              >
                {item.isResolved
                  ? "Çözüldü"
                  : "Bekliyor"}
              </div>

            </div>

            <div className="question-actions">

              {!item.isResolved && (

                <button
                  className="resolve-btn"
                  onClick={() =>
                    handleResolve(item.id)
                  }
                >
                  ✔ Çözüldü
                </button>

              )}

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(item.id)
                }
              >
                🗑 Sil
              </button>

            </div>

          </div>

        ))

      )}

    </div>
  );
}

export default UnknownQuestionsPage;