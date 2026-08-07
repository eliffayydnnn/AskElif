import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";
import "../../styles/conversationDetail.css";

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

  if (!conversation) {
    return <h2>Konuşma bulunamadı.</h2>;
  }

  return (
    <div className="chat-page">

      <div className="chat-header">

        <div>

          <div className="chat-title">
            💬 Conversation Detail
          </div>

          <div className="chat-subtitle">
            Kullanıcı ile AskElif arasında gerçekleşen konuşma.
          </div>

        </div>

        <Link
          to="/conversations"
          className="add-button"
        >
          ← Geri Dön
        </Link>

      </div>

      <div className="chat-container">

        {conversation.messages.map((message, index) => {

          const isUser = message.role === "User";

          return (

            <div
              key={index}
              className={`message ${
                isUser ? "user" : "assistant"
              }`}
            >

              <div className="message-bubble">

                <div className="message-role">

                  {isUser
                    ? "👤 User"
                    : "🤖 AskElif"}

                </div>

                <div>

                  {message.content}

                </div>

                <div className="message-time">

                  {new Date(
                    message.createdAt
                  ).toLocaleString("tr-TR")}

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}

export default ConversationDetailPage;