import { useEffect, useState } from "react";
import api from "../../api/api";

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/Dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <h2>Yükleniyor...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <hr />

      <h3>📚 Knowledge Sayısı: {dashboard.knowledgeCount}</h3>

      <h3>💬 Conversation Sayısı: {dashboard.conversationCount}</h3>

      <h3>📨 Message Sayısı: {dashboard.messageCount}</h3>

      <h3>❓ Unknown Question Sayısı: {dashboard.unknownQuestionCount}</h3>
    </div>
  );
}

export default DashboardPage;