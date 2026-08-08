import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  FileText,
  CheckCircle2,
  Clock3,
} from "lucide-react";

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

      setKnowledgeList((prev) =>
        prev.filter((item) => item.id !== id)
      );

      alert("Bilgi silindi.");
    } catch (error) {
      console.log(error);
      alert("Silme işlemi başarısız.");
    }
  };

  if (loading) {
    return (
      <div className="knowledge-loading">
        <div className="knowledge-spinner"></div>
        <p>Knowledge yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="knowledge-page">

      {/* HEADER */}
      <div className="knowledge-header">

        <div className="knowledge-heading">

          <div className="knowledge-heading-icon">
            <BookOpen size={23} />
          </div>

          <div>
            <div className="knowledge-title">
              Knowledge Management
            </div>

            <div className="knowledge-subtitle">
              Chatbot'un bilgi tabanını buradan yönetebilirsin.
            </div>
          </div>

        </div>

        <Link
          to="/knowledge/create"
          className="add-button"
        >
          <Plus size={18} />
          Yeni Bilgi
        </Link>

      </div>


      {/* SEARCH + COUNT */}
      <div className="knowledge-toolbar">

        <div className="search-wrapper">

          <Search
            size={18}
            className="search-icon"
          />

          <input
            className="search-box"
            type="text"
            placeholder="Başlık veya kategori ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="knowledge-count">
          <strong>{filteredList.length}</strong>
          <span>bilgi</span>
        </div>

      </div>


      {/* TABLE */}
      {filteredList.length === 0 ? (

        <div className="empty-state">

          <div className="empty-icon">
            <FileText size={28} />
          </div>

          <h3>Sonuç bulunamadı</h3>

          <p>
            Arama kriterlerine uygun herhangi bir bilgi bulunamadı.
          </p>

        </div>

      ) : (

        <div className="knowledge-table-wrapper">

          <table className="knowledge-table">

            <thead>

              <tr>
                <th>Bilgi</th>
                <th>Kategori</th>
                <th>Öncelik</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>

            </thead>

            <tbody>

              {filteredList.map((item) => (

                <tr key={item.id}>

                  {/* TITLE */}
                  <td>

                    <div className="knowledge-info">

                      <div className="knowledge-item-icon">
                        <FileText size={17} />
                      </div>

                      <div>

                        <strong>
                          {item.title || "Başlıksız bilgi"}
                        </strong>

                        {item.content && (
                          <span>
                            {item.content.length > 70
                              ? `${item.content.substring(0, 70)}...`
                              : item.content}
                          </span>
                        )}

                      </div>

                    </div>

                  </td>


                  {/* CATEGORY */}
                  <td>

                    <span className="category-badge">
                      {item.category || "Genel"}
                    </span>

                  </td>


                  {/* PRIORITY */}
                  <td>

                    <span className="priority-value">
                      {item.priority ?? "-"}
                    </span>

                  </td>


                  {/* STATUS */}
                  <td>

                    {item.isPublished ? (

                      <span className="status-badge published">
                        <CheckCircle2 size={14} />
                        Yayında
                      </span>

                    ) : (

                      <span className="status-badge draft">
                        <Clock3 size={14} />
                        Taslak
                      </span>

                    )}

                  </td>


                  {/* ACTIONS */}
                  <td>

                    <div className="action-buttons">

                      <Link
                        to={`/knowledge/edit/${item.id}`}
                        className="edit-btn"
                        title="Düzenle"
                      >
                        <Pencil size={15} />
                        Düzenle
                      </Link>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.id)}
                        title="Sil"
                      >
                        <Trash2 size={15} />
                        Sil
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default KnowledgePage;