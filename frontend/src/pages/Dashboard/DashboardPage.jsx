import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
    } catch {
      toast.error("Dashboard verileri alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>

        <span>
          Dashboard yükleniyor...
        </span>
      </div>
    );
  }


  /* =========================================
     ERROR
  ========================================= */

  if (!dashboard) {
    return (
      <div className="dashboard-error">

        <div className="dashboard-error-icon">
          !
        </div>

        <strong>
          Dashboard verisi alınamadı
        </strong>

        <span>
          Lütfen API bağlantısını kontrol edin.
        </span>

      </div>
    );
  }


  return (
    <div className="dashboard-page">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="dashboard-hero">

        <div className="hero-decoration hero-decoration-one"></div>

        <div className="hero-decoration hero-decoration-two"></div>


        <div className="hero-content">

          <span className="hero-badge">

            <Activity size={13} />

            Admin Dashboard

          </span>


          <h1>
            Hoş Geldin, <span>Elif</span> 👋
          </h1>


          <p>
            AskElif chatbot sistemini buradan yönetebilir,
            konuşmaları inceleyebilir ve cevaplanamayan
            soruları takip edebilirsin.
          </p>

        </div>


        <div className="hero-date">

          <span>
            Bugün
          </span>

          <strong>
            {today}
          </strong>

        </div>

      </section>



      {/* =========================================
          STAT CARDS
      ========================================= */}

      <section className="stats-grid">

        <DashboardCard
          title="Knowledge"
          value={dashboard.knowledgeCount}
          icon={<BookOpen size={21} />}
          description="Kayıtlı bilgi"
          type="pink"
        />


        <DashboardCard
          title="Conversations"
          value={dashboard.conversationCount}
          icon={<MessageCircle size={21} />}
          description="Toplam konuşma"
          type="purple"
        />


        <DashboardCard
          title="Messages"
          value={dashboard.messageCount}
          icon={<Mail size={21} />}
          description="Toplam mesaj"
          type="blue"
        />


        <DashboardCard
          title="Unknown Questions"
          value={dashboard.unknownQuestionCount}
          icon={<CircleHelp size={21} />}
          description="Cevap bekleyen"
          warning={
            dashboard.unknownQuestionCount > 0
          }
          type="orange"
        />

      </section>



      {/* =========================================
          QUICK ACTIONS
      ========================================= */}

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


          {/* NEW KNOWLEDGE */}

          <Link
            to="/knowledge/create"
            className="action-card"
          >

            <div className="action-icon pink">

              <Plus size={21} />

            </div>


            <div className="action-content">

              <h3>
                Yeni Bilgi Ekle
              </h3>

              <p>
                Chatbot'un bilgi tabanına yeni içerik ekle.
              </p>

            </div>


            <div className="action-arrow-wrapper">

              <ArrowRight
                className="action-arrow"
                size={17}
              />

            </div>

          </Link>



          {/* CONVERSATIONS */}

          <Link
            to="/conversations"
            className="action-card"
          >

            <div className="action-icon purple">

              <MessageCircle size={21} />

            </div>


            <div className="action-content">

              <h3>
                Konuşmaları Gör
              </h3>

              <p>
                Kullanıcıların chatbot ile yaptığı
                konuşmaları incele.
              </p>

            </div>


            <div className="action-arrow-wrapper">

              <ArrowRight
                className="action-arrow"
                size={17}
              />

            </div>

          </Link>



          {/* UNKNOWN QUESTIONS */}

          <Link
            to="/unknown-questions"
            className="action-card"
          >

            <div className="action-icon orange">

              <CircleHelp size={21} />

            </div>


            <div className="action-content">

              <h3>
                Unknown Questions
              </h3>

              <p>
                Chatbot'un cevaplayamadığı
                soruları yönet.
              </p>

            </div>


            <div className="action-arrow-wrapper">

              <ArrowRight
                className="action-arrow"
                size={17}
              />

            </div>

          </Link>

        </div>

      </section>



      {/* =========================================
          BOTTOM AREA
      ========================================= */}

      <section className="dashboard-bottom">


        {/* =========================================
            RECENT ACTIVITY
        ========================================= */}

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

              <Activity size={18} />

            </div>

          </div>


          <div className="activity-list">

            <div className="activity-empty">

              Henüz görüntülenecek bir
              aktivite bulunmuyor.

            </div>

          </div>

        </div>



        {/* =========================================
            SYSTEM STATUS
        ========================================= */}

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

              <Activity size={18} />

            </div>

          </div>


          <div className="status-list">


            <StatusItem
              icon={<Activity size={15} />}
              title="API"
              status="Online"
              type="success"
            />


            <StatusItem
              icon={<Database size={15} />}
              title="Database"
              status="Connected"
              type="success"
            />


            <StatusItem
              icon={<Bot size={15} />}
              title="Chatbot"
              status="Online"
              type="success"
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
  type,
}) {
  return (
    <div
      className={`stat-card ${
        warning ? "warning-card" : ""
      } ${type || ""}`}
    >

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


      <div className="stat-line"></div>

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


      <span
        className={`status-badge ${type}`}
      >

        <span className="status-dot"></span>

        {status}

      </span>

    </div>
  );
}


export default DashboardPage;