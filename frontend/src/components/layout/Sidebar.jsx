import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  CircleHelp,
  User,
  X,
} from "lucide-react";

import "../../styles/sidebar.css";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>

      {/* Logo Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <h1>AskElif</h1>
          <p>AI CV Assistant</p>
        </div>

        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
          title="Menüyü Kapat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menü */}
      <nav className="sidebar-menu">

        <Link
          to="/dashboard"
          title="Dashboard"
          onClick={onClose}
          className={`sidebar-item ${
            location.pathname === "/dashboard" ? "active" : ""
          }`}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/knowledge"
          title="Knowledge"
          onClick={onClose}
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
          title="Conversations"
          onClick={onClose}
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
          title="Unknown Questions"
          onClick={onClose}
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