import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  CircleHelp,
  Check,
  Trash2,
  BookOpen,
} from "lucide-react";

import { toast } from "react-toastify";
import api from "../../api/api";
import "../../styles/unknownQuestions.css";

function UnknownQuestionsPage() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const filtered = questions.filter((item) =>
      (item.question ?? "")
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
    } catch {
      toast.error("Sorular yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // KNOWLEDGE'A DÖNÜŞTÜR
  // =========================

  const handleConvertToKnowledge = (item) => {
    navigate("/knowledge/create", {
      state: {
        unknownQuestionId: item.id,
        question: item.question,
      },
    });
  };

  // =========================
  // ÇÖZÜLDÜ
  // =========================

  const handleResolve = async (id) => {
    if (
      !window.confirm(
        "Bu soruyu çözüldü olarak işaretlemek istiyor musunuz?"
      )
    ) {
      return;
    }

    try {
      setActionId(id);
      await api.put(`/UnknownQuestions/${id}/resolve`);

      setQuestions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                isResolved: true,
              }
            : item
        )
      );

      toast.success("Soru çözüldü olarak işaretlendi.");
    } catch {
      toast.error("İşlem başarısız.");
    } finally {
      setActionId(null);
    }
  };

  // =========================
  // SİL
  // =========================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Bu soruyu silmek istiyor musunuz?"
      )
    ) {
      return;
    }

    try {
      setActionId(id);
      await api.delete(`/UnknownQuestions/${id}`);

      setQuestions((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Soru silindi.");
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setActionId(null);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="unknown-loading">
        <div className="unknown-spinner"></div>

        <span>
          Sorular yükleniyor...
        </span>
      </div>
    );
  }

  return (
    <div className="unknown-page">

      {/* HEADER */}

      <div className="unknown-header">

        <div className="unknown-heading">

          <div className="unknown-heading-icon">
            <CircleHelp size={22} />
          </div>

          <div>

            <div className="unknown-title">
              Unknown Questions
            </div>

            <div className="unknown-subtitle">
              Chatbot'un cevaplayamadığı soruları
              buradan takip edebilirsin.
            </div>

          </div>

        </div>

      </div>


      {/* TOOLBAR */}

      <div className="unknown-toolbar">

        <div className="unknown-search-wrapper">

          <Search
            className="unknown-search-icon"
            size={17}
          />

          <input
            className="unknown-search"
            type="text"
            placeholder="Soru ara..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="unknown-count">

          <strong>
            {filteredQuestions.length}
          </strong>

          <span>
            soru
          </span>

        </div>

      </div>


      {/* EMPTY */}

      {filteredQuestions.length === 0 ? (

        <div className="unknown-empty">

          <div className="unknown-empty-icon">
            <CircleHelp size={25} />
          </div>

          <h3>
            Gösterilecek soru bulunamadı
          </h3>

          <p>
            Arama kriterlerine uygun bir soru
            bulunmuyor.
          </p>

        </div>

      ) : (

        <div className="unknown-list">

          {filteredQuestions.map((item) => (

            <div
              key={item.id}
              className={`unknown-card ${
                item.isResolved
                  ? "resolved"
                  : ""
              }`}
            >

              {/* CARD TOP */}

              <div className="unknown-card-top">

                <div className="question-icon">
                  <CircleHelp size={18} />
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

                    {item.isResolved ? (
                      <Check size={13} />
                    ) : (
                      "!"
                    )}

                  </span>

                  {item.isResolved
                    ? "Çözüldü"
                    : "Bekliyor"}

                </div>

              </div>


              {/* FOOTER */}

              <div className="unknown-card-footer">

                <div className="question-id">
                  Question #{item.id}
                </div>

                <div className="unknown-actions">

                  {/* KNOWLEDGE'A DÖNÜŞTÜR */}

                  {!item.isResolved && (

                    <button
                      className="convert-btn"
                      onClick={() =>
                        handleConvertToKnowledge(item)
                      }
                    >

                      <BookOpen size={14} />

                      Knowledge'a Dönüştür

                    </button>

                  )}


                  {/* ÇÖZÜLDÜ */}

                  {!item.isResolved && (

                    <button
                      className="resolve-btn"
                      onClick={() =>
                        handleResolve(item.id)
                      }
                      disabled={actionId === item.id}
                    >

                      <Check size={14} />

                      {actionId === item.id ? "İşleniyor..." : "Çözüldü"}

                    </button>

                  )}


                  {/* SİL */}

                  <button
                    className="unknown-delete-btn"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    disabled={actionId === item.id}
                  >

                    <Trash2 size={14} />

                    {actionId === item.id ? "Siliniyor..." : "Sil"}

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