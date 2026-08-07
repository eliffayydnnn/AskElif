import "../../styles/layout.css";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="content">
        <Navbar />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;