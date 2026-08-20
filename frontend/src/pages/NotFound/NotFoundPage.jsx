import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home, MessageSquare } from "lucide-react";
import "../../styles/notFound.css";

function NotFoundPage() {
  const token = localStorage.getItem("token");

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <FileQuestion size={48} />
        </div>

        <span className="not-found-code">404</span>

        <h1>Sayfa Bulunamadı</h1>

        <p>
          Aradığınız sayfa mevcut değil, silinmiş veya erişim yetkiniz bulunmuyor olabilir.
        </p>

        <div className="not-found-actions">
          {token ? (
            <Link to="/dashboard" className="not-found-primary-btn">
              <Home size={17} />
              Dashboard'a Dön
            </Link>
          ) : (
            <Link to="/" className="not-found-primary-btn">
              <ArrowLeft size={17} />
              Giriş Sayfasına Dön
            </Link>
          )}

          <Link to="/chat" className="not-found-secondary-btn">
            <MessageSquare size={17} />
            AskElif Chat
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
