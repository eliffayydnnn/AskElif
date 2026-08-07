import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h2 className="logo">🌸 AskElif</h2>

      <nav className="menu">
        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/knowledge"
          className={
            location.pathname.startsWith("/knowledge") ? "active" : ""
          }
        >
          📚 Knowledge
        </Link>

        <Link
          to="/conversations"
          className={
            location.pathname.startsWith("/conversations") ? "active" : ""
          }
        >
          💬 Conversations
        </Link>

        <Link
          to="/unknownquestions"
          className={
            location.pathname.startsWith("/unknownquestions")
              ? "active"
              : ""
          }
        >
          ❓ Unknown Questions
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;