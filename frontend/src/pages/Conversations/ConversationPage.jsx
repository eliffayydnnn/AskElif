import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

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
    <div style={{ padding: "40px" }}>
      <h1>Conversations</h1>

      <input
        type="text"
        placeholder="Session Id ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          margin: "25px 0",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />

      {filteredConversations.length === 0 ? (
        <p>Konuşma bulunamadı.</p>
      ) : (
        filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
              background: "#fff",
            }}
          >
            <h3>Session</h3>

            <p>{conversation.sessionId}</p>

            <p>
              <strong>Başlangıç:</strong>{" "}
              {new Date(conversation.startedAt).toLocaleString("tr-TR")}
            </p>

            <p>
              <strong>Mesaj Sayısı:</strong>{" "}
              {conversation.messages.length}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Link
                to={`/conversations/${conversation.id}`}
                style={{
                  background: "#4F8EF7",
                  color: "#fff",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Detay
              </Link>

              <button
                onClick={() => handleDelete(conversation.id)}
                style={{
                  background: "#EF4444",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
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