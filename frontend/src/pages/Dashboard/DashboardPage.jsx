import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  MessageCircle,
  Mail,
  CircleHelp,
  Plus,
  ArrowRight,
  Activity,
  Database,
  Bot,
  CheckCircle2,
} from "lucide-react";

import api from "../../api/api";
import "../../styles/dashboard.css";

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/Dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.log("Dashboard Hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Dashboard yükleniyor...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-error">
        <strong>Dashboard verisi alınamadı</strong>
        <span>Lütfen API bağlantısını kontrol edin.</span>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* HERO */}

      <section className="dashboard-hero">

        <div className="hero-content">

          <span className="hero-badge">
            <Activity size={14} />
            Admin Dashboard
          </span>

          <h1>
            Hoş Geldin, <span>Elif</span> 👋
          </h1>

          <p>
            AskElif chatbot sistemini buradan yönetebilir,
            konuşmaları inceleyebilir ve cevaplanamayan soruları
            takip edebilirsin.
          </p>

        </div>

        <div className="hero-date">
          <span>Bugün</span>
          <strong>{today}</strong>
        </div>

      </section>


      {/* STAT CARDS */}

      <section className="stats-grid">

        <DashboardCard
          title="Knowledge"
          value={dashboard.knowledgeCount}
          icon={<BookOpen size={22} />}
          description="Kayıtlı bilgi"
        />

        <DashboardCard
          title="Conversations"
          value={dashboard.conversationCount}
          icon={<MessageCircle size={22} />}
          description="Toplam konuşma"
        />

        <DashboardCard
          title="Messages"
          value={dashboard.messageCount}
          icon={<Mail size={22} />}
          description="Toplam mesaj"
        />

        <DashboardCard
          title="Unknown Questions"
          value={dashboard.unknownQuestionCount}
          icon={<CircleHelp size={22} />}
          description="Cevap bekleyen"
          warning={dashboard.unknownQuestionCount > 0}
        />

      </section>


      {/* QUICK ACTIONS */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <span className="section-eyebrow">
              Hızlı Erişim
            </span>

            <h2>
              Quick Actions
            </h2>
          </div>

        </div>


        <div className="quick-actions-grid">

          <Link
            to="/knowledge/create"
            className="action-card"
          >

            <div className="action-icon pink">
              <Plus size={22} />
            </div>

            <div className="action-content">

              <h3>
                Yeni Bilgi Ekle
              </h3>

              <p>
                Chatbot'un bilgi tabanına yeni içerik ekle.
              </p>

            </div>

            <ArrowRight
              className="action-arrow"
              size={19}
            />

          </Link>


          <Link
            to="/conversations"
            className="action-card"
          >

            <div className="action-icon purple">
              <MessageCircle size={22} />
            </div>

            <div className="action-content">

              <h3>
                Konuşmaları Gör
              </h3>

              <p>
                Kullanıcıların chatbot ile yaptığı konuşmaları incele.
              </p>

            </div>

            <ArrowRight
              className="action-arrow"
              size={19}
            />

          </Link>


          <Link
            to="/unknownquestions"
            className="action-card"
          >

            <div className="action-icon orange">
              <CircleHelp size={22} />
            </div>

            <div className="action-content">

              <h3>
                Unknown Questions
              </h3>

              <p>
                Chatbot'un cevaplayamadığı soruları yönet.
              </p>

            </div>

            <ArrowRight
              className="action-arrow"
              size={19}
            />

          </Link>

        </div>

      </section>


      {/* BOTTOM AREA */}

      <section className="dashboard-bottom">


        {/* RECENT ACTIVITY */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <span className="section-eyebrow">
                Aktivite
              </span>

              <h2>
                Recent Activity
              </h2>

            </div>

            <div className="panel-icon">
              <Activity size={19} />
            </div>

          </div>


          <div className="activity-list">

            <ActivityItem
              title="Yeni bilgi eklendi"
              time="2 dk önce"
              icon={<BookOpen size={17} />}
            />

            <ActivityItem
              title="Conversation görüntülendi"
              time="10 dk önce"
              icon={<MessageCircle size={17} />}
            />

            <ActivityItem
              title="Unknown Question çözüldü"
              time="1 saat önce"
              icon={<CheckCircle2 size={17} />}
            />

          </div>

        </div>


        {/* SYSTEM STATUS */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <span className="section-eyebrow">
                Sistem
              </span>

              <h2>
                System Status
              </h2>

            </div>

            <div className="panel-icon">
              <Activity size={19} />
            </div>

          </div>


          <div className="status-list">

            <StatusItem
              icon={<Activity size={16} />}
              title="API"
              status="Online"
              type="success"
            />

            <StatusItem
              icon={<Database size={16} />}
              title="Database"
              status="Connected"
              type="success"
            />

            <StatusItem
              icon={<Bot size={16} />}
              title="Chatbot"
              status="Training"
              type="warning"
            />

          </div>

        </div>

      </section>

    </div>
  );
}


/* =========================================
   DASHBOARD CARD
========================================= */

function DashboardCard({
  title,
  value,
  icon,
  description,
  warning,
}) {
  return (
    <div className={`stat-card ${warning ? "warning-card" : ""}`}>

      <div className="stat-top">

        <div className="stat-icon">
          {icon}
        </div>

        {warning && (
          <span className="stat-alert">
            Dikkat
          </span>
        )}

      </div>

      <div className="stat-title">
        {title}
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-description">
        {description}
      </div>

    </div>
  );
}


/* =========================================
   ACTIVITY ITEM
========================================= */

function ActivityItem({
  title,
  time,
  icon,
}) {
  return (
    <div className="activity-item">

      <div className="activity-icon">
        {icon}
      </div>

      <div className="activity-info">

        <span>
          {title}
        </span>

        <small>
          {time}
        </small>

      </div>

    </div>
  );
}


/* =========================================
   STATUS ITEM
========================================= */

function StatusItem({
  icon,
  title,
  status,
  type,
}) {
  return (
    <div className="status-item">

      <div className="status-left">

        <div className="status-icon">
          {icon}
        </div>

        <span>
          {title}
        </span>

      </div>

      <span className={`status-badge ${type}`}>

        <span className="status-dot"></span>

        {status}

      </span>

    </div>
  );
}

export default DashboardPage;