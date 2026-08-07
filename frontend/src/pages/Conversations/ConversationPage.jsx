import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        .toLowerCase()
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
    return <h2>Yükleniyor...</h2>;
  }

  return (
    <div className="conversations-page">

      <div className="conversations-header">

        <div>

          <div className="conversations-title">
            💬 Conversations
          </div>

          <div className="conversations-subtitle">
            Kullanıcıların chatbot ile yaptığı konuşmaları inceleyebilirsin.
          </div>

        </div>

      </div>

      <input
        className="conversation-search"
        placeholder="🔍 Session ID ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredConversations.length === 0 ? (

        <div className="empty-state">
          Konuşma bulunamadı.
        </div>

      ) : (

        filteredConversations.map((conversation) => (

          <div
            key={conversation.id}
            className="conversation-card"
          >

            <div className="conversation-top">

              <div>

                <div className="session-title">
                  👤 Session #{conversation.id}
                </div>

                <div className="session-date">
                  {new Date(
                    conversation.startedAt
                  ).toLocaleString("tr-TR")}
                </div>

              </div>

              <div className="message-count">
                💬 {conversation.messages.length} Mesaj
              </div>

            </div>

            <div className="card-actions">

              <Link
                to={`/conversations/${conversation.id}`}
                className="view-btn"
              >
                Görüntüle
              </Link>

              <button
                className="delete-btn"
                onClick={() => handleDelete(conversation.id)}
              >
                Sil
              </button>

            </div>

          </div>

        ))

      )}

    </div>
  );
}

export default ConversationPage;