import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#FCE8EF",
        padding: "25px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          marginBottom: "40px",
          color: "#C86B98",
        }}
      >
        🌸 AskElif
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <Link to="/dashboard">🏠 Dashboard</Link>

        <Link to="/knowledge">📚 Knowledge</Link>

        <Link to="/conversations">💬 Conversations</Link>

        <Link to="/unknownquestions">
          ❓ Unknown Questions
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;