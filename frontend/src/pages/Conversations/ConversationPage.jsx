import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Search, Eye, Trash2 } from "lucide-react";
import api from "../../api/api";
import "../../styles/conversations.css";

function ConversationPage() {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const filtered = conversations.filter((conversation) =>
      conversation.sessionId
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredConversations(filtered);
  }, [search, conversations]);

  const fetchConversations = async () => {
    try {
      const response = await api.get("/Conversation");

      setConversations(response.data);
      setFilteredConversations(response.data);
    } catch (error) {
      console.log(error);
      alert("Konuşmalar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bu konuşmayı silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/Conversation/${id}`);

      setConversations((prev) =>
        prev.filter((item) => item.id !== id)
      );

      alert("Konuşma silindi.");
    } catch (error) {
      console.log(error);
      alert("Silme işlemi başarısız.");
    }
  };

  if (loading) {
    return (
      <div className="conversation-loading">
        <div className="conversation-spinner"></div>
        <span>Konuşmalar yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="conversations-page">

      {/* HEADER */}
      <div className="conversations-header">

        <div className="conversations-heading">

          <div className="conversations-heading-icon">
            <MessageCircle size={22} />
          </div>

          <div>
            <div className="conversations-title">
              Conversations
            </div>

            <div className="conversations-subtitle">
              Kullanıcıların chatbot ile yaptığı konuşmaları inceleyebilirsin.
            </div>
          </div>

        </div>

        <div className="conversation-total">
          <strong>{conversations.length}</strong>
          <span>Toplam Konuşma</span>
        </div>

      </div>


      {/* SEARCH */}
      <div className="conversation-toolbar">

        <div className="conversation-search-wrapper">

          <Search
            size={17}
            className="conversation-search-icon"
          />

          <input
            className="conversation-search"
            type="text"
            placeholder="Session ID ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="conversation-result-count">
          {filteredConversations.length} sonuç
        </div>

      </div>


      {/* CONTENT */}
      {filteredConversations.length === 0 ? (

        <div className="conversation-empty">

          <div className="conversation-empty-icon">
            <MessageCircle size={26} />
          </div>

          <h3>
            Konuşma bulunamadı
          </h3>

          <p>
            Arama kriterlerinize uygun herhangi bir konuşma bulunamadı.
          </p>

        </div>

      ) : (

        <div className="conversation-list">

          {filteredConversations.map((conversation) => (

            <div
              key={conversation.id}
              className="conversation-card"
            >

              <div className="conversation-card-main">

                <div className="conversation-icon">
                  <MessageCircle size={19} />
                </div>

                <div className="conversation-info">

                  <div className="session-title">
                    Session #{conversation.id}
                  </div>

                  <div className="session-id">
                    {conversation.sessionId}
                  </div>

                  <div className="session-date">
                    {new Date(
                      conversation.startedAt
                    ).toLocaleString("tr-TR")}
                  </div>

                </div>

              </div>


              <div className="conversation-card-right">

                <div className="message-count">
                  <MessageCircle size={15} />
                  <span>
                    {conversation.messages?.length ?? 0} Mesaj
                  </span>
                </div>

                <div className="card-actions">

                  <Link
                    to={`/conversations/${conversation.id}`}
                    className="view-btn"
                  >
                    <Eye size={15} />
                    Görüntüle
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(conversation.id)
                    }
                  >
                    <Trash2 size={15} />
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

export default ConversationPage;