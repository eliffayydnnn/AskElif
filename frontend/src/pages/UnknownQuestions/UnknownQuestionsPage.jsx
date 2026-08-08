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
      item.question
        .toLowerCase()
        .includes(search.toLowerCase())
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
    ) {
      return;
    }

    try {
      await api.put(`/UnknownQuestions/${id}/resolve`);

      setQuestions((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isResolved: true }
            : item
        )
      );

      alert("Soru çözüldü olarak işaretlendi.");
    } catch (error) {
      console.log(error);
      alert("İşlem başarısız.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu soruyu silmek istiyor musunuz?")) {
      return;
    }

    try {
      await api.delete(`/UnknownQuestions/${id}`);

      setQuestions((prev) =>
        prev.filter((item) => item.id !== id)
      );

      alert("Soru silindi.");
    } catch (error) {
      console.log(error);
      alert("Silinemedi.");
    }
  };

  if (loading) {
    return (
      <div className="unknown-loading">
        <div className="unknown-spinner"></div>
        <span>Sorular yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="unknown-page">

      {/* HEADER */}

      <div className="unknown-header">

        <div className="unknown-heading">

          <div className="unknown-heading-icon">
            ❓
          </div>

          <div>
            <div className="unknown-title">
              Unknown Questions
            </div>

            <div className="unknown-subtitle">
              Chatbot'un cevaplayamadığı soruları buradan takip edebilirsin.
            </div>
          </div>

        </div>

      </div>

      {/* TOOLBAR */}

      <div className="unknown-toolbar">

        <div className="unknown-search-wrapper">

          <span className="unknown-search-icon">
            🔍
          </span>

          <input
            className="unknown-search"
            type="text"
            placeholder="Soru ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="unknown-count">
          <strong>{filteredQuestions.length}</strong>
          soru
        </div>

      </div>

      {/* QUESTIONS */}

      {filteredQuestions.length === 0 ? (

        <div className="unknown-empty">

          <div className="unknown-empty-icon">
            ❓
          </div>

          <h3>
            Gösterilecek soru bulunamadı
          </h3>

          <p>
            Arama kriterlerine uygun bir soru bulunmuyor.
          </p>

        </div>

      ) : (

        <div className="unknown-list">

          {filteredQuestions.map((item) => (

            <div
              key={item.id}
              className={`unknown-card ${
                item.isResolved ? "resolved" : ""
              }`}
            >

              <div className="unknown-card-top">

                <div className="question-icon">
                  ?
                </div>

                <div className="question-content">

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
                  className={`question-status ${
                    item.isResolved
                      ? "resolved"
                      : "pending"
                  }`}
                >
                  <span>
                    {item.isResolved ? "✓" : "!"}
                  </span>

                  {item.isResolved
                    ? "Çözüldü"
                    : "Bekliyor"}
                </div>

              </div>

              <div className="unknown-card-footer">

                <div className="question-id">
                  Question #{item.id}
                </div>

                <div className="unknown-actions">

                  {!item.isResolved && (
                    <button
                      className="resolve-btn"
                      onClick={() =>
                        handleResolve(item.id)
                      }
                    >
                      ✓ Çözüldü
                    </button>
                  )}

                  <button
                    className="unknown-delete-btn"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                  >
                    Sil
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default UnknownQuestionsPage;