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

      <div>

        <div className="sidebar-logo">
          <h1>AskElif</h1>
          <p>AI CV Assistant</p>
        </div>

        <nav className="sidebar-menu">

          <Link
            to="/dashboard"
            className={`sidebar-item ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            <LayoutDashboard size={20} />
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
            <BookOpen size={20} />
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
            <MessageCircle size={20} />
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
            <CircleHelp size={20} />
            <span>Unknown Questions</span>
          </Link>

        </nav>

      </div>

      <div className="sidebar-footer">

        <div className="profile-box">

          <div className="profile-avatar">
            <User size={22} />
          </div>

          <div>

            <div className="profile-name">
              Elif Aydın
            </div>

            <div className="profile-role">
              Administrator
            </div>

          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;