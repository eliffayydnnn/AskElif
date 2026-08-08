import { Bell, Settings, User } from "lucide-react";
import "../../styles/layout.css";

function Navbar() {
  return (
    <header className="navbar">

      <div className="navbar-left">
        <h2 className="navbar-title">
          AskElif Admin
        </h2>
      </div>

      <div className="navbar-right">

        <button className="icon-button">
          <Bell size={18} />
        </button>

        <button className="icon-button">
          <Settings size={18} />
        </button>

        <div className="profile-divider"></div>

        <div className="profile">

          <div className="profile-avatar">
            <User size={18} />
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

    </header>
  );
}

export default Navbar;