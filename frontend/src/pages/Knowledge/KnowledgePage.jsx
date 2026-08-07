import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import "../../styles/knowledge.css";

function KnowledgePage() {
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledge();
  }, []);

  useEffect(() => {
    const result = knowledgeList.filter((item) => {
      const title = item.title ?? "";
      const category = item.category ?? "";

      return (
        title.toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase())
      );
    });

    setFilteredList(result);
  }, [search, knowledgeList]);

  const fetchKnowledge = async () => {
    try {
      const response = await api.get("/Knowledge");

      setKnowledgeList(response.data);
      setFilteredList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bu bilgiyi silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/Knowledge/${id}`);

      setKnowledgeList((prev) => prev.filter((item) => item.id !== id));

      alert("Bilgi silindi.");
    } catch (error) {
      console.log(error);
      alert("Silme işlemi başarısız.");
    }
  };

  if (loading) {
    return <h2>Yükleniyor...</h2>;
  }

  return (
    <div className="knowledge-page">

      <div className="knowledge-header">

        <div>

          <div className="knowledge-title">
            📚 Knowledge Management
          </div>

          <div className="knowledge-subtitle">
            Chatbot bilgisini buradan yönetebilirsin.
          </div>

        </div>

        <Link
          to="/knowledge/create"
          className="add-button"
        >
          + Yeni Bilgi
        </Link>

      </div>

      <input
        className="search-box"
        placeholder="🔍 Başlık veya kategori ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredList.length === 0 ? (

        <div className="empty-state">
          Sonuç bulunamadı.
        </div>

      ) : (

        <table className="knowledge-table">

          <thead>

            <tr>

              <th>Başlık</th>

              <th>Kategori</th>

              <th>Öncelik</th>

              <th>Durum</th>

              <th>İşlemler</th>

            </tr>

          </thead>

          <tbody>

            {filteredList.map((item) => (

              <tr key={item.id}>

                <td>
                  <strong>{item.title || "-"}</strong>
                </td>

                <td>

                  <span className="category-badge">
                    {item.category}
                  </span>

                </td>

                <td>
                  {item.priority}
                </td>

                <td>
                  {item.isPublished ? "✅ Yayında" : "📝 Taslak"}
                </td>

                <td>

                  <div className="action-buttons">

                    <Link
                      to={`/knowledge/edit/${item.id}`}
                      className="edit-btn"
                    >
                      Düzenle
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Sil
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default KnowledgePage;