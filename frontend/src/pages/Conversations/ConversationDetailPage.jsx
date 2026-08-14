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
  }, [id]);

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

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="conversation-detail-loading">
        <div className="conversation-spinner"></div>

        <span>
          Konuşma yükleniyor...
        </span>
      </div>
    );
  }

  /* =========================================
     NOT FOUND
  ========================================= */

  if (!conversation) {
    return (
      <div className="conversation-detail-empty">

        <div className="empty-chat-icon">
          💬
        </div>

        <h3>
          Konuşma bulunamadı
        </h3>

        <p>
          Bu konuşmaya ait herhangi bir kayıt bulunamadı.
        </p>

        <Link
          to="/conversations"
          className="back-button"
        >
          ← Konuşmalara Dön
        </Link>

      </div>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="conversation-detail-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="chat-header">

        <div className="chat-heading">

          <div className="chat-heading-icon">
            💬
          </div>

          <div>

            <div className="chat-title">
              Conversation Detail
            </div>

            <div className="chat-subtitle">
              Kullanıcı ile AskElif arasında gerçekleşen konuşma.
            </div>

          </div>

        </div>

        <Link
          to="/conversations"
          className="back-button"
        >
          ← Geri Dön
        </Link>

      </div>


      {/* =========================================
          CONVERSATION INFO
      ========================================= */}

      <div className="conversation-detail-info">

        <div className="conversation-info-item">

          <span className="info-label">
            Session ID
          </span>

          <span className="info-value">
            #{conversation.id}
          </span>

        </div>


        <div className="conversation-info-divider"></div>


        <div className="conversation-info-item">

          <span className="info-label">
            Başlangıç
          </span>

          <span className="info-value">
            {new Date(
              conversation.startedAt
            ).toLocaleString("tr-TR")}
          </span>

        </div>


        <div className="conversation-info-divider"></div>


        <div className="conversation-info-item">

          <span className="info-label">
            Mesaj
          </span>

          <span className="info-value">
            {conversation.messages?.length ?? 0}
          </span>

        </div>

      </div>


      {/* =========================================
          CHAT
      ========================================= */}

      <div className="chat-container">

        {conversation.messages?.length > 0 ? (

          conversation.messages.map((message, index) => {

            const isUser =
              message.role?.toLowerCase() === "user";

            return (
              <div
                key={message.id ?? index}
                className={`message ${
                  isUser
                    ? "user"
                    : "assistant"
                }`}
              >

                {/* AVATAR */}

                <div className="message-avatar">
                  {isUser ? "👤" : "🤖"}
                </div>


                {/* CONTENT */}

                <div className="message-content">

                  <div className="message-role">
                    {isUser
                      ? "User"
                      : "AskElif"}
                  </div>

                  <div className="message-bubble">
                    {message.content}
                  </div>

                  <div className="message-time">

                    {message.createdAt
                      ? new Date(
                          message.createdAt
                        ).toLocaleString("tr-TR")
                      : ""}

                  </div>

                </div>

              </div>
            );

          })

        ) : (

          <div className="conversation-detail-empty">

            <div className="empty-chat-icon">
              💬
            </div>

            <h3>
              Henüz mesaj yok
            </h3>

            <p>
              Bu konuşmada henüz herhangi bir mesaj bulunmuyor.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default ConversationDetailPage;