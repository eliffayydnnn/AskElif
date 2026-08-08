import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Save,
  Tag,
  HelpCircle,
  FileText,
} from "lucide-react";

import api from "../../api/api";
import "../../styles/createKnowledge.css";

function CreateKnowledgePage() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim() || !category.trim()) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      setSaving(true);

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

      alert("Bilgi eklenirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-knowledge-page">

      {/* HEADER */}

      <div className="create-knowledge-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/knowledge")}
        >
          <ArrowLeft size={17} />
          Knowledge'a Dön
        </button>

        <div className="create-knowledge-heading">

          <div className="create-knowledge-icon">
            <BookOpen size={23} />
          </div>

          <div>
            <h1>Yeni Bilgi Ekle</h1>

            <p>
              AskElif'in bilgi tabanına yeni bir soru ve cevap ekle.
            </p>
          </div>

        </div>

      </div>


      {/* MAIN CONTENT */}

      <div className="create-knowledge-layout">

        {/* FORM CARD */}

        <div className="create-knowledge-card">

          <form onSubmit={handleSubmit}>

            {/* QUESTION */}

            <div className="form-group">

              <label>
                <HelpCircle size={16} />
                Soru
              </label>

              <input
                type="text"
                placeholder="Örneğin: Hangi teknolojileri biliyorsun?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <span className="form-hint">
                Kullanıcının chatbot'a sorabileceği soruyu girin.
              </span>

            </div>


            {/* ANSWER */}

            <div className="form-group">

              <label>
                <FileText size={16} />
                Cevap
              </label>

              <textarea
                placeholder="Bu soruya verilecek cevabı yazın..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={8}
              />

              <span className="form-hint">
                Chatbot bu bilgiyi kullanarak kullanıcıya cevap verecek.
              </span>

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label>
                <Tag size={16} />
                Kategori
              </label>

              <input
                type="text"
                placeholder="Örneğin: Eğitim, Yetenekler, Projeler"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <span className="form-hint">
                Bilginin hangi kategoriye ait olduğunu belirtin.
              </span>

            </div>


            {/* BUTTONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/knowledge")}
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

                {saving ? "Kaydediliyor..." : "Bilgiyi Kaydet"}
              </button>

            </div>

          </form>

        </div>


        {/* INFORMATION CARD */}

        <div className="create-knowledge-info">

          <div className="info-card-icon">
            💡
          </div>

          <h3>Bilgi eklerken</h3>

          <p>
            Chatbot'un daha doğru cevaplar verebilmesi için
            soruları ve cevapları mümkün olduğunca açık ve
            anlaşılır şekilde yazmaya çalış.
          </p>


          <div className="info-list">

            <div className="info-item">

              <span>01</span>

              <div>
                <strong>Açık bir soru yaz</strong>

                <p>
                  Kullanıcının sorabileceği doğal bir ifade kullan.
                </p>
              </div>

            </div>


            <div className="info-item">

              <span>02</span>

              <div>
                <strong>Net bir cevap ver</strong>

                <p>
                  Bilgiyi kısa ve anlaşılır şekilde açıklayın.
                </p>
              </div>

            </div>


            <div className="info-item">

              <span>03</span>

              <div>
                <strong>Kategori belirle</strong>

                <p>
                  Bilgileri düzenli tutmak için uygun kategori kullan.
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