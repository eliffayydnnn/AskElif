import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

function ConversationDetailPage() {
  const { id } = useParams();

  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversation();
  }, []);

  const fetchConversation = async () => {
    try {
      const response = await api.get(`/Conversation/${id}`);
      setConversation(response.data);
    } catch (error) {
      console.log(error);
      alert("Konuşma yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Yükleniyor...</h2>;
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <Link
        to="/conversations"
        style={{
          textDecoration: "none",
          color: "#E26D9F",
          fontWeight: "600",
        }}
      >
        ← Konuşmalara Dön
      </Link>

      <h1 style={{ marginTop: "25px" }}>Conversation</h1>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <p>
          <strong>Session Id</strong>
        </p>

        <p>{conversation.sessionId}</p>

        <p style={{ marginTop: "15px" }}>
          <strong>Başlangıç Tarihi</strong>
        </p>

        <p>
          {new Date(conversation.startedAt).toLocaleString("tr-TR")}
        </p>
      </div>

      {conversation.messages.map((message, index) => {
        const isUser = message.role === "User";

        return (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "16px",
                borderRadius: "16px",
                background: isUser ? "#FCE7F3" : "#EEF2FF",
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  marginBottom: "8px",
                  color: isUser ? "#C65D7B" : "#4F46E5",
                }}
              >
                {isUser ? "👤 User" : "🤖 AskElif"}
              </div>

              <div>{message.content}</div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  marginTop: "10px",
                  textAlign: "right",
                }}
              >
                {new Date(message.createdAt).toLocaleString("tr-TR")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ConversationDetailPage;