import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login/LoginPage";
import ChatPage from "./pages/Chat/ChatPage";

import DashboardPage from "./pages/Dashboard/DashboardPage";

import KnowledgePage from "./pages/Knowledge/KnowledgePage";
import CreateKnowledgePage from "./pages/Knowledge/CreateKnowledgePage";
import EditKnowledgePage from "./pages/Knowledge/EditKnowledgePage";

import ConversationPage from "./pages/Conversations/ConversationPage";
import ConversationDetailPage from "./pages/Conversations/ConversationDetailPage";

import UnknownQuestionsPage from "./pages/UnknownQuestions/UnknownQuestionsPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

function App() {
  return (
    <Routes>

      {/* Public Chatbot */}
      <Route
        path="/chat"
        element={<ChatPage />}
      />

      {/* Login */}
      <Route
        path="/"
        element={<LoginPage />}
      />

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

      {/* Unknown Questions */}
      <Route
        path="/unknownquestions"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UnknownQuestionsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={<NotFoundPage />}
      />

    </Routes>
  );
}

export default App;