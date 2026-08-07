import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import "../../styles/dashboard.css";

const today = new Date().toLocaleDateString("tr-TR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

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
      alert("Dashboard yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Yükleniyor...</h2>;
  }

  if (!dashboard) {
    return <h2>Dashboard verisi alınamadı.</h2>;
  }

  return (
    <div>

      {/* HERO */}

      <div className="dashboard-hero">
        <div>

          <div className="hero-title">
            👋 Hoş Geldin, Elif
          </div>

          <div className="hero-text">
            AskElif Admin Paneline hoş geldin.
            <br />
            Buradan chatbot bilgisini yönetebilir,
            konuşmaları inceleyebilir ve cevaplanamayan
            soruları kolayca takip edebilirsin.
          </div>

        </div>

        <div className="hero-date">
          📅 {today}
        </div>

      </div>

      {/* KARTLAR */}

      <div className="dashboard-grid">

        <DashboardCard
          title="Knowledge"
          value={dashboard.knowledgeCount}
          icon="📚"
        />

        <DashboardCard
          title="Conversations"
          value={dashboard.conversationCount}
          icon="💬"
        />

        <DashboardCard
          title="Messages"
          value={dashboard.messageCount}
          icon="📨"
        />

        <DashboardCard
          title="Unknown Questions"
          value={dashboard.unknownQuestionCount}
          icon="❓"
        />

      </div>

      {/* QUICK ACTIONS */}

      <div className="quick-actions">

        <h2 className="section-title">
          ⚡ Quick Actions
        </h2>

        <div className="actions-grid">

          <Link
            to="/knowledge/create"
            className="action-card"
          >
            <div className="action-icon">➕</div>

            <div className="action-title">
              Yeni Bilgi Ekle
            </div>

            <div className="action-description">
              Chatbot'un bilgisini artırmak için yeni bilgi ekle.
            </div>

          </Link>

          <Link
            to="/conversations"
            className="action-card"
          >
            <div className="action-icon">
              💬
            </div>

            <div className="action-title">
              Konuşmaları Gör
            </div>

            <div className="action-description">
              Kullanıcı konuşmalarını incele.
            </div>

          </Link>

          <Link
            to="/unknownquestions"
            className="action-card"
          >
            <div className="action-icon">
              ❓
            </div>

            <div className="action-title">
              Unknown Questions
            </div>

            <div className="action-description">
              Chatbot'un cevaplayamadığı soruları görüntüle.
            </div>

          </Link>

        </div>

      </div>

      {/* ALT PANEL */}

      <div className="dashboard-bottom">

        <div className="dashboard-panel">

          <h3>📝 Recent Activity</h3>

          <div className="activity-item">
            <div className="activity-title">
              Yeni bilgi eklendi
            </div>

            <div className="activity-time">
              2 dk önce
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-title">
              Conversation görüntülendi
            </div>

            <div className="activity-time">
              10 dk önce
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-title">
              Unknown Question çözüldü
            </div>

            <div className="activity-time">
              1 saat önce
            </div>
          </div>

        </div>

        <div className="dashboard-panel">

          <h3>⚡ System Status</h3>

          <div className="status-item">
            <span>API</span>

            <span className="status-badge status-ok">
              Online
            </span>
          </div>

          <div className="status-item">
            <span>Database</span>

            <span className="status-badge status-ok">
              Connected
            </span>
          </div>

          <div className="status-item">
            <span>Chatbot</span>

            <span className="status-badge status-warning">
              Training
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="dashboard-card">

      <div className="dashboard-icon">
        {icon}
      </div>

      <div className="dashboard-label">
        {title}
      </div>

      <div className="dashboard-value">
        {value}
      </div>

    </div>
  );
}

export default DashboardPage;