import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  Save,
  Tag,
  HelpCircle,
  FileText,
} from "lucide-react";

import { toast } from "react-toastify";
import api from "../../api/api";
import "../../styles/createKnowledge.css";

function CreateKnowledgePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const unknownQuestionId =
    location.state?.unknownQuestionId ?? null;

  const initialQuestion =
    location.state?.question ?? "";

  const [question, setQuestion] =
    useState(initialQuestion);

  const [answer, setAnswer] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  // =========================
  // KAYDET
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.warning("Lütfen soruyu doldurun.");
      return;
    }

    if (!answer.trim()) {
      toast.warning("Lütfen cevabı doldurun.");
      return;
    }

    if (!category.trim()) {
      toast.warning("Lütfen kategori girin.");
      return;
    }

    try {
      setSaving(true);

      // =========================
      // UNKNOWN QUESTION
      // =========================

      if (unknownQuestionId) {
        await api.post(
          `/UnknownQuestions/${unknownQuestionId}/convert-to-knowledge`,
          {
            answer: answer,
            category: category,
          }
        );

        toast.success("Cevap kaydedildi ve Knowledge'a eklendi.");
      }

      // =========================
      // NORMAL KNOWLEDGE
      // =========================

      else {
        await api.post(
          "/Knowledge",
          {
            title: question,
            category: category,
            content: answer,
            source: "Admin",
            tags: "",
            priority: 1,
            isPublished: true,
          }
        );

        toast.success("Bilgi başarıyla eklendi.");
      }

      // Knowledge listesine dön
      navigate("/knowledge");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Bilgi kaydedilirken bir hata oluştu."
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-knowledge-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="create-knowledge-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/knowledge")}
          disabled={saving}
        >
          <ArrowLeft size={17} />

          Knowledge'a Dön
        </button>

        <div className="create-knowledge-heading">

          <div className="create-knowledge-icon">
            <BookOpen size={23} />
          </div>

          <div>

            <h1>
              {unknownQuestionId
                ? "Soruyu Cevapla"
                : "Yeni Bilgi Ekle"}
            </h1>

            <p>
              {unknownQuestionId
                ? "Cevaplanamayan soruya bir cevap ekleyerek Knowledge tabanına kaydet."
                : "AskElif'in bilgi tabanına yeni bir soru ve cevap ekle."}
            </p>

          </div>

        </div>

      </div>

      {/* =========================
          MAIN
      ========================= */}

      <div className="create-knowledge-layout">

        {/* FORM */}

        <div className="create-knowledge-card">

          <form onSubmit={handleSubmit}>

            {/* SORU */}

            <div className="form-group">

              <label>
                <HelpCircle size={16} />
                Soru
              </label>

              <input
                type="text"
                placeholder="Örneğin: Hangi teknolojileri biliyorsun?"
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                readOnly={Boolean(
                  unknownQuestionId
                )}
              />

              <span className="form-hint">
                {unknownQuestionId
                  ? "Bu soru Unknown Questions ekranından geldi."
                  : "Kullanıcının chatbot'a sorabileceği soruyu girin."}
              </span>

            </div>

            {/* CEVAP */}

            <div className="form-group">

              <label>
                <FileText size={16} />
                Cevap
              </label>

              <textarea
                placeholder="Bu soruya verilecek doğru cevabı buraya yazın..."
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                rows={8}
              />

              <span className="form-hint">
                Chatbot'un bu soruya vereceği
                cevabı buraya yazın.
              </span>

            </div>

            {/* KATEGORİ */}

            <div className="form-group">

              <label>
                <Tag size={16} />
                Kategori
              </label>

              <input
                type="text"
                placeholder="Örneğin: Kişisel Bilgiler, Hobiler, Eğitim"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              />

              <span className="form-hint">
                Bilginin hangi kategoriye ait
                olduğunu belirtin.
              </span>

            </div>

            {/* BUTTONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate(unknownQuestionId ? "/unknownquestions" : "/knowledge")
                }
                disabled={saving}
              >
                Vazgeç
              </button>

              <button
                type="submit"
                className="save-button"
                disabled={saving}
              >

                <Save size={17} />

                {saving
                  ? "Kaydediliyor..."
                  : unknownQuestionId
                  ? "Cevabı Kaydet"
                  : "Bilgiyi Kaydet"}

              </button>

            </div>

          </form>

        </div>

        {/* =========================
            INFORMATION CARD
        ========================= */}

        <div className="create-knowledge-info">

          <div className="info-card-icon">
            💡
          </div>

          <h3>
            {unknownQuestionId
              ? "Soruyu cevaplama"
              : "Bilgi eklerken"}
          </h3>

          <p>
            {unknownQuestionId
              ? "Bu soru chatbot tarafından daha önce cevaplanamadı. Doğru cevabı girerek chatbot'un gelecekte bu soruya cevap verebilmesini sağlayabilirsin."
              : "Chatbot'un daha doğru cevaplar verebilmesi için soruları ve cevapları mümkün olduğunca açık ve anlaşılır şekilde yazmaya çalış."}
          </p>

          <div className="info-list">

            <div className="info-item">

              <span>01</span>

              <div>

                <strong>
                  Açık bir soru yaz
                </strong>

                <p>
                  Kullanıcının sorabileceği
                  doğal bir ifade kullan.
                </p>

              </div>

            </div>

            <div className="info-item">

              <span>02</span>

              <div>

                <strong>
                  Net bir cevap ver
                </strong>

                <p>
                  Chatbot'un kullanacağı
                  doğru cevabı yaz.
                </p>

              </div>

            </div>

            <div className="info-item">

              <span>03</span>

              <div>

                <strong>
                  Kategori belirle
                </strong>

                <p>
                  Bilgileri düzenli tutmak
                  için uygun kategori kullan.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateKnowledgePage;