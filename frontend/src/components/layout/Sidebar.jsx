import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItemStyle = (path) => ({
    display: "block",
    padding: "12px 16px",
    borderRadius: "10px",
    textDecoration: "none",
    color: location.pathname === path ? "#C65D7B" : "#555",
    background: location.pathname === path ? "#FDEBF3" : "transparent",
    fontWeight: location.pathname === path ? "600" : "400",
    transition: "0.2s",
  });

  return (
    <aside
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#FFF",
        borderRight: "1px solid #F3D7E4",
        padding: "25px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          color: "#E26D9F",
          marginBottom: "40px",
        }}
      >
        🌸 AskElif
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Link to="/dashboard" style={menuItemStyle("/dashboard")}>
          🏠 Dashboard
        </Link>

        <Link to="/knowledge" style={menuItemStyle("/knowledge")}>
          📚 Knowledge
        </Link>

        <Link to="/conversations" style={menuItemStyle("/conversations")}>
          💬 Conversations
        </Link>

        <Link
          to="/unknownquestions"
          style={menuItemStyle("/unknownquestions")}
        >
          ❓ Unknown Questions
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;