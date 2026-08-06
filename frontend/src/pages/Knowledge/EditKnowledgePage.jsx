import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

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

        setTitle(data.title);
        setCategory(data.category);
        setContent(data.content);
        setSource(data.source);
        setTags(data.tags);
        setPriority(data.priority);
        setIsPublished(data.isPublished);
      } catch (error) {
        console.log(error);
        alert("Bilgi yüklenemedi.");
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

      alert("Bilgi güncellendi.");

      navigate("/knowledge");
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);
      alert("Güncelleme başarısız.");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1>Bilgi Güncelle</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label>Başlık</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "12px", marginTop: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Kategori</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: "12px", marginTop: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>İçerik</label>
          <textarea
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", padding: "12px", marginTop: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Kaynak</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            style={{ width: "100%", padding: "12px", marginTop: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Etiketler</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: "100%", padding: "12px", marginTop: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Öncelik</label>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            style={{ width: "100%", padding: "12px", marginTop: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />{" "}
            Yayında
          </label>
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
          Güncelle
        </button>
      </form>
    </div>
  );
}

export default EditKnowledgePage;