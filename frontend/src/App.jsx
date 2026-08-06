import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import KnowledgePage from "./pages/Knowledge/KnowledgePage";
import CreateKnowledgePage from "./pages/Knowledge/CreateKnowledgePage";
import EditKnowledgePage from "./pages/Knowledge/EditKnowledgePage";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

function App() {
  return (
    <Routes>
      <Route
  path="/knowledge/create"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <CreateKnowledgePage />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/knowledge/edit/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <EditKnowledgePage />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/knowledge"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <KnowledgePage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;