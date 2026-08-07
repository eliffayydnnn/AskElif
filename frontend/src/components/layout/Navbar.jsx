function Navbar() {
  return (
    <header className="navbar">
      <h2 className="navbar-title">
        🌸 AskElif Admin Panel
      </h2>

      <div className="user-info">
        <div className="user-avatar">
          👤
        </div>

        <div>
          <div className="user-name">
            Elif Aydın
          </div>

          <div className="user-role">
            Administrator
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;