import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/Login/LoginPage";

import DashboardPage from "./pages/Dashboard/DashboardPage";

import KnowledgePage from "./pages/Knowledge/KnowledgePage";
import CreateKnowledgePage from "./pages/Knowledge/CreateKnowledgePage";
import EditKnowledgePage from "./pages/Knowledge/EditKnowledgePage";

import ConversationPage from "./pages/Conversations/ConversationPage";
import ConversationDetailPage from "./pages/Conversations/ConversationDetailPage";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginPage />} />

      {/* Dashboard */}
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

      {/* Knowledge */}
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

      {/* Conversations */}
      <Route
        path="/conversations"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ConversationPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/conversations/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ConversationDetailPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Bulunamayan sayfa */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;