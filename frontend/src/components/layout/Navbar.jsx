function Navbar() {
  return (
    <header
      style={{
        height: "70px",
        background: "#FFFFFF",
        borderBottom: "1px solid #F3D7E4",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "#555",
        }}
      >
        AskElif Admin Panel
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "#FCE8EF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
          }}
        >
          👤
        </div>

        <div>
          <strong>Elif Aydın</strong>
          <br />
          <small style={{ color: "#888" }}>Administrator</small>
        </div>
      </div>
    </header>
  );
}

export default Navbar;