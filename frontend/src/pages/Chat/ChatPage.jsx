import { useState } from "react";
import { Send, Bot, CircleCheck } from "lucide-react";
import api from "../../api/api";
import "../../styles/chat.css";

function ChatPage() {
  const [conversationId, setConversationId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

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
      const response = await api.post("/Chat", {
        conversationId: conversationId,
        message: userMessage,
      });

      const data = response.data;

      setConversationId(data.conversationId);

      setMessages((prev) => [
        ...prev,
        {
          role: "Assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);

      setMessages((prev) => [
        ...prev,
        {
          role: "Assistant",
          content:
            "Bir hata oluştu. Lütfen tekrar deneyin.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page">

      {/* HEADER */}

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

        <div className="chat-status">
          <span className="chat-status-dot"></span>
          Online
        </div>

      </header>


      {/* MAIN */}

      <main className="chat-main">

        {/* WELCOME */}

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


        {/* MESSAGES */}

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
                    {isUser ? "Sen" : "AskElif"}
                  </div>

                  <div>
                    {item.content}
                  </div>

                </div>

              </div>
            );
          })}


          {/* LOADING */}

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


        {/* INPUT */}

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
            disabled={loading || !message.trim()}
          >
            <Send size={19} />
          </button>

        </form>


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