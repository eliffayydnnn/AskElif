import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/layout.css";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="content">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;