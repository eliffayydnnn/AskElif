import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import "../../styles/editKnowledge.css";

function EditKnowledgePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState(1);
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(`/Knowledge/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        setTitle(data.title ?? "");
        setCategory(data.category ?? "");
        setContent(data.content ?? "");
        setSource(data.source ?? "");
        setTags(data.tags ?? "");
        setPriority(data.priority ?? 1);
        setIsPublished(data.isPublished ?? true);
      } catch (error) {
        console.log(error);
        alert("Bilgi yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/Knowledge/${id}`,
        {
          title,
          category,
          content,
          source,
          tags,
          priority,
          isPublished,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Bilgi başarıyla güncellendi.");

      navigate("/knowledge");
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);

      alert("Güncelleme başarısız.");
    }
  };

  if (loading) {
    return (
      <div className="edit-knowledge-loading">
        <div className="edit-knowledge-spinner"></div>
        <span>Bilgi yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="edit-knowledge-page">

      <div className="edit-knowledge-header">
        <div>
          <h1 className="edit-knowledge-title">
            Bilgi Güncelle
          </h1>

          <p className="edit-knowledge-subtitle">
            Mevcut bilgi kaydını düzenleyebilir ve güncelleyebilirsin.
          </p>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/knowledge")}
        >
          ← Knowledge
        </button>
      </div>

      <div className="edit-knowledge-card">

        <form onSubmit={handleSubmit}>

          <div className="edit-form-group">
            <label htmlFor="title">
              Başlık
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bilginin başlığını girin..."
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="category">
              Kategori
            </label>

            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Örneğin: Eğitim, Yetenekler, Deneyim..."
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="content">
              İçerik
            </label>

            <textarea
              id="content"
              rows="8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bilginin içeriğini girin..."
            />
          </div>

          <div className="edit-form-row">

            <div className="edit-form-group">
              <label htmlFor="source">
                Kaynak
              </label>

              <input
                id="source"
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Bilginin kaynağı..."
              />
            </div>

            <div className="edit-form-group">
              <label htmlFor="tags">
                Etiketler
              </label>

              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Örn: .NET, C#, Backend"
              />
            </div>

          </div>

          <div className="edit-form-row">

            <div className="edit-form-group">
              <label htmlFor="priority">
                Öncelik
              </label>

              <input
                id="priority"
                type="number"
                min="1"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
              />
            </div>

            <div className="publish-option">

              <div>
                <div className="publish-title">
                  Yayın Durumu
                </div>

                <div className="publish-description">
                  Bu bilgi chatbot tarafından kullanılabilir.
                </div>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />

                <span className="slider"></span>
              </label>

            </div>

          </div>

          <div className="edit-form-actions">

            <button
              type="button"
              className="edit-cancel-button"
              onClick={() => navigate("/knowledge")}
            >
              İptal
            </button>

            <button
              type="submit"
              className="edit-save-button"
            >
              Değişiklikleri Kaydet
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default EditKnowledgePage;