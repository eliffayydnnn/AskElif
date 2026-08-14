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
  Database,
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
    const value = search.toLowerCase().trim();

    const result = knowledgeList.filter((item) => {
      const title = item.title ?? "";
      const category = item.category ?? "";
      const content = item.content ?? "";

      return (
        title.toLowerCase().includes(value) ||
        category.toLowerCase().includes(value) ||
        content.toLowerCase().includes(value)
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
      console.log("Knowledge Hatası:", error);
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
        <span>Knowledge yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="knowledge-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="knowledge-hero">

        <div className="knowledge-hero-content">

          <span className="knowledge-badge">
            <Database size={13} />
            Knowledge Management
          </span>

          <h1>
            Bilgi Tabanı <span>Yönetimi</span>
          </h1>

          <p>
            AskElif'in cevaplarını oluşturduğun bilgi kayıtlarını
            buradan yönetebilir, düzenleyebilir ve yeni bilgiler
            ekleyebilirsin.
          </p>

        </div>

        <Link
          to="/knowledge/create"
          className="knowledge-add-button"
        >
          <Plus size={18} />
          Yeni Bilgi
        </Link>

      </section>


      {/* =========================
          OVERVIEW
      ========================= */}

      <section className="knowledge-overview">

        <div className="knowledge-overview-card">

          <div className="overview-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Toplam Bilgi</span>
            <strong>{knowledgeList.length}</strong>
          </div>

        </div>


        <div className="knowledge-overview-card">

          <div className="overview-icon green">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Yayında</span>
            <strong>
              {
                knowledgeList.filter(
                  (item) => item.isPublished
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="knowledge-overview-card">

          <div className="overview-icon purple">
            <FileText size={20} />
          </div>

          <div>
            <span>Sonuç</span>
            <strong>{filteredList.length}</strong>
          </div>

        </div>

      </section>


      {/* =========================
          TOOLBAR
      ========================= */}

      <section className="knowledge-toolbar">

        <div className="knowledge-toolbar-left">

          <div className="knowledge-section-title">

            <span className="section-eyebrow">
              İçerikler
            </span>

            <h2>
              Knowledge Records
            </h2>

          </div>

        </div>


        <div className="knowledge-search-area">

          <div className="knowledge-search-wrapper">

            <Search
              size={17}
              className="knowledge-search-icon"
            />

            <input
              className="knowledge-search"
              type="text"
              placeholder="Bilgi, kategori veya içerik ara..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="knowledge-count">
            <strong>{filteredList.length}</strong>
            <span>kayıt</span>
          </div>

        </div>

      </section>


      {/* =========================
          TABLE / EMPTY
      ========================= */}

      {filteredList.length === 0 ? (

        <div className="knowledge-empty">

          <div className="knowledge-empty-icon">
            <FileText size={27} />
          </div>

          <h3>
            Sonuç bulunamadı
          </h3>

          <p>
            Arama kriterlerine uygun herhangi bir
            bilgi kaydı bulunamadı.
          </p>

          {search && (
            <button
              type="button"
              className="clear-search-button"
              onClick={() => setSearch("")}
            >
              Aramayı Temizle
            </button>
          )}

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

                  {/* BİLGİ */}

                  <td>

                    <div className="knowledge-info">

                      <div className="knowledge-item-icon">
                        <FileText size={17} />
                      </div>

                      <div className="knowledge-info-content">

                        <strong>
                          {item.title || "Başlıksız bilgi"}
                        </strong>

                        {item.content && (
                          <span>
                            {item.content.length > 90
                              ? `${item.content.substring(0, 90)}...`
                              : item.content}
                          </span>
                        )}

                      </div>

                    </div>

                  </td>


                  {/* KATEGORİ */}

                  <td>

                    <span className="category-badge">
                      {item.category || "Genel"}
                    </span>

                  </td>


                  {/* ÖNCELİK */}

                  <td>

                    <span className="priority-wrapper">

                      <span className="priority-value">
                        {item.priority ?? "-"}
                      </span>

                    </span>

                  </td>


                  {/* DURUM */}

                  <td>

                    {item.isPublished ? (

                      <span className="status-badge published">
                        <CheckCircle2 size={13} />
                        Yayında
                      </span>

                    ) : (

                      <span className="status-badge draft">
                        <Clock3 size={13} />
                        Taslak
                      </span>

                    )}

                  </td>


                  {/* İŞLEMLER */}

                  <td>

                    <div className="action-buttons">

                      <Link
                        to={`/knowledge/edit/${item.id}`}
                        className="edit-btn"
                        title="Düzenle"
                      >
                        <Pencil size={14} />
                        Düzenle
                      </Link>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        title="Sil"
                      >
                        <Trash2 size={14} />
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