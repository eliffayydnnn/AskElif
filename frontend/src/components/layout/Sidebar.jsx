import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  CircleHelp,
  User,
} from "lucide-react";

import "../../styles/sidebar.css";

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <h1>AskElif</h1>
        <p>AI CV Assistant</p>
      </div>

      {/* Menü */}
      <nav className="sidebar-menu">

        <Link
          to="/dashboard"
          className={`sidebar-item ${
            location.pathname === "/dashboard" ? "active" : ""
          }`}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/knowledge"
          className={`sidebar-item ${
            location.pathname.startsWith("/knowledge")
              ? "active"
              : ""
          }`}
        >
          <BookOpen size={19} />
          <span>Knowledge</span>
        </Link>

        <Link
          to="/conversations"
          className={`sidebar-item ${
            location.pathname.startsWith("/conversations")
              ? "active"
              : ""
          }`}
        >
          <MessageCircle size={19} />
          <span>Conversations</span>
        </Link>

        <Link
          to="/unknownquestions"
          className={`sidebar-item ${
            location.pathname.startsWith("/unknownquestions")
              ? "active"
              : ""
          }`}
        >
          <CircleHelp size={19} />
          <span>Unknown Questions</span>
        </Link>

      </nav>

      {/* Alt Profil */}
      <div className="sidebar-footer">

        <div className="sidebar-profile-box">

          <div className="sidebar-profile-avatar">
            <User size={19} />
          </div>

          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">
              Elif Aydın
            </div>

            <div className="sidebar-profile-role">
              Administrator
            </div>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;