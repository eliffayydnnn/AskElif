import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import KnowledgePage from "./pages/Knowledge/KnowledgePage";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/knowledge"
        element={
          <ProtectedRoute>
            <KnowledgePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;