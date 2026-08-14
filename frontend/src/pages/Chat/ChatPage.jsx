import { useState } from "react";
import {
  Send,
  Bot,
  CircleCheck,
  Plus,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import api from "../../api/api";
import "../../styles/chat.css";

function ChatPage() {
  const [conversationId, setConversationId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // YENİ SOHBET
  // =========================

  const handleNewChat = () => {
    if (loading) {
      return;
    }

    setConversationId(null);
    setMessages([]);
    setMessage("");
  };

  // =========================
  // MESAJ GÖNDER
  // =========================

  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    // Kullanıcı mesajını ekle
    setMessages((prev) => [
      ...prev,
      {
        role: "User",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      console.log("========== CHAT REQUEST ==========");
      console.log("ConversationId:", conversationId);
      console.log("Message:", userMessage);
      console.log("==================================");

      const response = await api.post("/Chat", {
        conversationId: conversationId,
        message: userMessage,
      });

      const data = response.data;

      console.log("========== CHAT RESPONSE ==========");
      console.log("Response:", data);
      console.log("===================================");

      // Conversation ID'yi sakla
      setConversationId(data.conversationId);

      // Bot cevabını ekle
      setMessages((prev) => [
        ...prev,
        {
          role: "Assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.error("========== CHAT ERROR ==========");
      console.error("Error:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error(
        "Message:",
        error.response?.data?.message
      );
      console.error(
        "Detail:",
        error.response?.data?.detail
      );
      console.error("================================");

      setMessages((prev) => [
        ...prev,
        {
          role: "Assistant",
          content:
            error.response?.data?.message ||
            "Chat sırasında bir hata oluştu.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="chat-page-header">

        <div className="chat-brand">

          <div className="chat-brand-icon">
            🌸
          </div>

          <div>
            <div className="chat-brand-name">
              AskElif
            </div>

            <div className="chat-brand-subtitle">
              AI destekli CV Assistant
            </div>
          </div>

        </div>

        <div className="chat-header-actions">

          {/* YENİ SOHBET */}

          <button
            type="button"
            className="chat-new-button"
            onClick={handleNewChat}
            disabled={loading}
          >
            <Plus size={17} />
            Yeni Sohbet
          </button>

          {/* ONLINE DURUMU */}

          <div className="chat-status">
            <span className="chat-status-dot"></span>
            Online
          </div>

        </div>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="chat-main">

        {/* =========================
            WELCOME
        ========================= */}

        {messages.length === 0 && (
          <div className="chat-welcome">

            <div className="chat-welcome-icon">
              <Bot size={32} />
            </div>

            <h1>
              Merhaba, ben <span>AskElif</span> 👋
            </h1>

            <p>
              Elif hakkında merak ettiğin soruları
              bana sorabilirsin. Eğitim, deneyim,
              projeler ve teknik yetenekleri hakkında
              bilgi verebilirim.
            </p>

          </div>
        )}


        {/* =========================
            MESSAGES
        ========================= */}

        <div className="chat-messages">

          {messages.map((item, index) => {

            const isUser = item.role === "User";

            return (
              <div
                key={index}
                className={`chat-message ${
                  isUser ? "user" : "assistant"
                }`}
              >

                <div className="chat-bubble">

                  <div className="chat-message-role">
                    {isUser
                      ? "Sen"
                      : "AskElif"}
                  </div>

                  <div className="chat-message-content">

                    {isUser ? (
                      item.content
                    ) : (
                      <ReactMarkdown>
                        {item.content}
                      </ReactMarkdown>
                    )}

                  </div>

                </div>

              </div>
            );
          })}


          {/* =========================
              LOADING
          ========================= */}

          {loading && (
            <div className="chat-message assistant">

              <div className="chat-loading">

                <span></span>
                <span></span>
                <span></span>

              </div>

            </div>
          )}

        </div>


        {/* =========================
            INPUT
        ========================= */}

        <form
          className="chat-input-area"
          onSubmit={handleSend}
        >

          <input
            className="chat-input"
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="AskElif'e bir soru sor..."
          />

          <button
            className="chat-send-button"
            type="submit"
            disabled={
              loading || !message.trim()
            }
          >
            <Send size={19} />
          </button>

        </form>


        {/* =========================
            FOOTER
        ========================= */}

        <div className="chat-footer">

          <CircleCheck
            size={12}
            style={{
              verticalAlign: "middle",
              marginRight: "4px",
            }}
          />

          AskElif yalnızca bilgi tabanındaki
          içeriklere göre cevap verir.

        </div>

      </main>

    </div>
  );
}

export default ChatPage;