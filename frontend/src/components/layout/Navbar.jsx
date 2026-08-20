import { Bell, Settings, User, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout.css";

function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Çıkış yapmak istediğinize emin misiniz?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <header className="navbar">

      <div className="navbar-left">
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={onToggleSidebar}
          title="Menüyü Aç"
        >
          <Menu size={22} />
        </button>

        <h2 className="navbar-title">
          AskElif Admin
        </h2>
      </div>

      <div className="navbar-right">

        <button className="icon-button" title="Bildirimler">
          <Bell size={18} />
        </button>

        <button className="icon-button" title="Ayarlar">
          <Settings size={18} />
        </button>

        <div className="profile-divider"></div>

        <div className="profile">

          <div className="profile-avatar">
            <User size={18} />
          </div>

          <div className="profile-details">
            <div className="profile-name">
              Elif Aydın
            </div>

            <div className="profile-role">
              Administrator
            </div>
          </div>

        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
          title="Çıkış Yap"
        >
          <LogOut size={18} />
        </button>

      </div>

    </header>
  );
}

export default Navbar;