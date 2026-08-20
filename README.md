# 🌸 AskElif - AI CV Assistant & Management Platform

[![Backend .NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat&logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-8E75B2?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![Jina AI](https://img.shields.io/badge/Embeddings-Jina_v3-000000?style=flat)](https://jina.ai/)
[![Tests](https://img.shields.io/badge/Tests-72_Passed-success?style=flat)](https://github.com/eliffayydnnn/AskElif)

**AskElif**, Elif Aydın'ın mesleki yetenekleri, projeleri, eğitimi ve deneyimleri hakkında akıllı, hızlı ve bağlama uygun cevaplar sunan **AI destekli bir CV Asistanı ve Yönetim Paneli** platformudur.

Sistem, **RAG (Retrieval-Augmented Generation)** mimarisini kullanarak semantik arama, cosine benzerlik kontrolleri ve **Google Gemini 2.5 Flash** büyük dil modeli ile bütünleşik çalışır. Cevaplanamayan veya düşük benzerliğe sahip soruları otomatik tespit ederek yönetici onayına sunan bir **Unknown Questions** mekanizmasına sahiptir.

---

## 📌 İçindekiler

- [Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
- [Teknoloji Yığını ve Kullanım Amaçları](#-teknoloji-yığını-ve-kullanım-amaçları)
- [Mimari ve Proje Yapısı](#-mimari-ve-proje-yapısı)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Test ve Kalite Güvencesi](#-test-ve-kalite-güvencesi)
- [Ekran Görüntüleri (Screenshots)](#-ekran-görüntüleri-screenshots)
- [Kurulum ve Çalıştırma Adımları](#-kurulum-ve-çalıştırma-adımları)
- [Çevre Değişkenleri ve Güvenlik](#-çevre-değişkenleri-ve-güvenlik)
- [Gelecek Yol Haritası](#-gelecek-yol-haritası)

---

## ✨ Öne Çıkan Özellikler

### 🤖 1. AI CV Chatbot & RAG Hibrit Cevaplama
- **Semantik Arama:** Kullanıcı sorularına bilgi tabanındaki içeriklerle Jina AI embedding vektörleri ve Cosine Similarity kullanarak benzerlik araması yapar.
- **Benzerlik Eşikleri:**
  - **Yüksek Benzerlik (>= 0.70):** Bilgi tabanındaki yanıtı doğrudan sunar.
  - **Orta Benzerlik (0.45 - 0.70):** Gemini 2.5 Flash modeli ile soru-cevap alaka kontrolü (`relevance check`) yaparak cevabı doğrular.
  - **Düşük Benzerlik (< 0.45):** Bilgi bulunamadığında kullanıcıya nazikçe bildirir ve soruyu admin kontrolü için kaydeder.

### ❓ 2. Otomatik Bilinmeyen Soru Tespiti (Unknown Questions)
- Bilgi tabanında bulunmayan veya alakasız olarak değerlendirilen kullanıcı sorularını veritabanında kaydeder.
- Admin panelinde tek tıkla **"Knowledge'a Dönüştür"** özelliği ile yanıt eklenip bilgi tabanına aktarılabilir.

### 📚 3. Knowledge Base Management (CMS)
- Bilgi kayıtları için Tam CRUD (Ekleme, Listeleme, Güncelleme, Silme) desteği.
- Kategori etiketleme, öncelik puanlama (`priority`) ve taslak/yayın durumu (`isPublished`) takibi.

### 📊 4. Konuşma Geçmişi ve Admin Dashboard
- Konuşma oturum takibi (`conversationId`) ve tüm sohbet geçmişini inceleme olanağı.
- Dashboard üzerinde istatistik kartları (Toplam Bilgi, Yayında Olanlar, Toplam Sohbet, Bekleyen Sorular).

### 🔒 5. Güvenli Kimlik Doğrulama & Yetkilendirme
- BCrypt algoritması ile yönetici şifreleme doğrulaması.
- JWT (JSON Web Token) Bearer yetkilendirmesi ile admin API'lerinin korunması.

### 📱 6. Responsive UI & UX
- Masaüstü, tablet ve mobil cihazlarla tam uyumlu **Mobil Navigation Drawer** menü sistemi.
- Toast bildirimleri (`react-toastify`), yükleme durumları (loading spinners), 404 Sayfa Bulunamadı ekranı.

---

## 🛠 Teknoloji Yığını ve Kullanım Amaçları

### Backend (.NET 8 Web API)
- **.NET 8 SDK / C#:** RESTful API servis katmanı.
- **Entity Framework Core 8:** SQL Server veritabanı erişimi ve ORM mimarisi.
- **BCrypt.Net-Next:** Admin parola hashleme ve güvenli doğrulama.
- **System.IdentityModel.Tokens.Jwt:** JWT token üretimi ve kimlik doğrulama.
- **Swagger / OpenAPI:** API uç noktalarını belgeleme ve interaktif test etme.

### Frontend (React 19 + Vite 8)
- **React 19 (`v19.2`):** Bileşen tabanlı kullanıcı arayüzü kütüphanesi.
- **Vite 8 (`v8.2`):** Hızlı modül derleme ve geliştirme sunucusu.
- **React Router DOM 7 (`v7.18`):** İstemci tarafı dinamik sayfa yönlendirmeleri ve korumalı rota (ProtectedRoute) yönetimi.
- **Axios (`v1.19`):** HTTP istemcisi ve 401 Unauthorized yanıtlarını yakalayan interceptor yapısı.
- **Lucide React (`v1.30`):** Modern ikon kütüphanesi.
- **React Markdown (`v10.1`):** Chatbot yanıtlarındaki markdown formatlarını render etme.
- **React Toastify (`v11.1`):** Kullanıcı bilgilendirme ve toast bildirimleri.

### AI & Vektör Teknolojileri
- **Google Gemini 2.5 Flash (`gemini-2.5-flash`):** Büyük Dil Modeli (LLM) ile alaka kontrolü ve yanıt üretimi.
- **Jina AI (`jina-embeddings-v3`):** Metin tabanlı içeriklerin 1536-boyutlu vektör karşılıklarını üretme.

### Testing & QA Tools
- **xUnit & Moq:** Backend birim ve servis testleri.
- **Microsoft.AspNetCore.Mvc.Testing:** WebApplicationFactory ile backend API entegrasyon testleri.
- **EF Core InMemory Database:** Test sırasında isolated (izole) veritabanı kullanımı.
- **Vitest 4 & React Testing Library & JSDOM:** Frontend bileşen, entegrasyon ve kullanıcı akış testleri.
- **Oxlint:** Statik kod analizi ve linter.

---

## 🏗 Mimari ve Proje Yapısı

Proje, katmanlı mimari (`Clean Architecture` ilkeleri, Repository Pattern) ve modüler React yapısı benimsenerek geliştirilmiştir:

```text
AskElif/
├── backend/
│   ├── AskElif.API/                # .NET 8 Web API Projesi
│   │   ├── Controllers/            # Auth, Chat, Knowledge, UnknownQuestions, Dashboard API uçları
│   │   ├── Services/               # Chat, KnowledgeSearch, Gemini, Embedding iş mantığı
│   │   ├── Repositories/           # Veritabanı veri erişim katmanı (Repository Pattern)
│   │   ├── DTOs/                   # Request/Response veri aktarım nesneleri
│   │   ├── Models/                 # EF Core veritabanı varlıkları (Entities)
│   │   ├── Data/                   # ApplicationDbContext ve EF Core konfigürasyonları
│   │   └── Program.cs              # DI konteyneri, middleware ve JWT konfigürasyonu
│   └── AskElif.Tests/              # xUnit Backend Test Projesi
│       ├── ChatServiceBoundaryTests.cs
│       ├── AuthServiceTests.cs
│       ├── ControllerTests.cs
│       ├── IntegrationTests.cs
│       └── InvalidInputTests.cs
├── frontend/
│   ├── src/
│   │   ├── api/                    # Axios instance ve 401 interceptor yapısı
│   │   ├── components/             # Layout (Navbar, Sidebar, ProtectedRoute) ve UI elemanları
│   │   ├── pages/                  # Chat, Login, Dashboard, Knowledge, Conversations, UnknownQuestions, NotFound
│   │   ├── styles/                 # Modüler Vanilla CSS stilleri
│   │   └── test/                   # Vitest ve React Testing Library test dosyaları
│   ├── package.json
│   └── vite.config.js
├── docs/                           # Ekran görüntüleri rehberi
│   └── screenshots/
├── README.md
└── .gitignore
```

---

## 🔌 API Dokümantasyonu

Backend API'leri Swagger UI üzerinden interaktif olarak test edilebilir (`http://localhost:5212/swagger`).

### 🔑 Authentication API
- `POST /api/Auth/login` *(Public)*
  - **Amaç:** Admin girişi yapar ve JWT Bearer Token döndürür.
  - **Request Body:** `{ "email": "admin@askelif.com", "password": "admin123" }`
  - **Response Body:** `{ "token": "eyJhbGciOi...", "fullName": "Elif Aydin" }`

### 💬 Chat API
- `POST /api/Chat` *(Public)*
  - **Amaç:** AskElif AI chatbot'una soru gönderir.
  - **Request Body:** `{ "conversationId": 12, "message": "Elif hangi dilleri biliyor?" }`
  - **Response Body:** `{ "conversationId": 12, "answer": "Elif C#, JavaScript...", "isAnswered": true }`

### 📚 Knowledge Base API
- `GET /api/Knowledge` *(Protected `[Authorize]`)* - Tüm bilgi kayıtlarını listeler.
- `GET /api/Knowledge/{id}` *(Protected `[Authorize]`)* - Belirli bir bilgi kaydını getirir.
- `POST /api/Knowledge` *(Protected `[Authorize]`)* - Yeni bilgi kaydı ekler.
- `PUT /api/Knowledge/{id}` *(Protected `[Authorize]`)* - Mevcut bilgiyi günceller.
- `DELETE /api/Knowledge/{id}` *(Protected `[Authorize]`)* - Bilgi kaydını siler.

### ❓ Unknown Questions API
- `GET /api/UnknownQuestions` *(Protected `[Authorize]`)* - Cevaplanamayan soruları listeler.
- `PUT /api/UnknownQuestions/{id}/resolve` *(Protected `[Authorize]`)* - Soruyu "Çözüldü" olarak işaretler.
- `POST /api/UnknownQuestions/{id}/convert-to-knowledge` *(Protected `[Authorize]`)* - Soruyu bilgi tabanına kaydeder.
- `DELETE /api/UnknownQuestions/{id}` *(Protected `[Authorize]`)* - Soruyu siler.

### 📊 Dashboard & Conversations API
- `GET /api/Dashboard` *(Protected `[Authorize]`)* - Admin metriklerini ve sistem istatistiklerini getirir.
- `GET /api/Conversation` *(Protected `[Authorize]`)* - Tüm sohbet oturumlarını listeler.
- `GET /api/Conversation/{id}` *(Protected `[Authorize]`)* - Detaylı mesaj geçmişini görüntüler.
- `DELETE /api/Conversation/{id}` *(Protected `[Authorize]`)* - Sohbet geçmişini siler.

---

## 🧪 Test ve Kalite Güvencesi

Projede hem backend hem de frontend tarafında **toplam 72 adet test** yazılmış ve tamamı hatasız geçmektedir.

```text
==================================================
TEST SONUÇLARI ÖZETİ
==================================================
- Backend Testleri (xUnit + Moq + EF InMemory): 47 Passed, 0 Failed
- Frontend Testleri (Vitest + RTL + JSDOM):     25 Passed, 0 Failed
--------------------------------------------------
TOPLAM:                                          72 Passed, 0 Failed
==================================================
```

### Testleri Çalıştırma Komutları

#### 1. Backend Testlerini Çalıştırma:
```bash
cd backend/AskElif.Tests
dotnet test
```

#### 2. Frontend Testlerini Çalıştırma:
```bash
cd frontend
npm run test
```

#### 3. Frontend Kod Lint Kontrolü:
```bash
cd frontend
npm run lint
```

---

## 📸 Screenshots (Ekran Görüntüleri)

Ekran görüntüleri rehberi `docs/screenshots/` klasöründe yer almaktadır. Uygulama çalıştırıldığında aşağıdaki ekranlar kaydedilebilir:

- **Public Chat:** Kullanıcıların Elif'in deneyimleri, projeleri, teknik yetkinlikleri ve eğitimi hakkında doğal dilde sorular sorabildiği AI destekli sohbet arayüzü.
- <img width="1910" height="943" alt="image" src="https://github.com/user-attachments/assets/5b70a3cc-0420-4165-972c-405bfaa9da30" />

- **Admin Login:** Yönetim paneline güvenli erişim sağlayan JWT tabanlı yönetici giriş ekranı.
- <img width="1900" height="938" alt="image" src="https://github.com/user-attachments/assets/282d21fb-0bce-470d-a870-ceb31d1210f4" />

- **Dashboard:** Bilgi tabanı, sohbetler ve bilinmeyen sorular gibi temel sistem özelliklerinin görüntülendiği yönetim paneli.
- <img width="1870" height="936" alt="image" src="https://github.com/user-attachments/assets/f603a425-9fe7-400e-b98d-e36194353ed8" />

- **Knowledge Base:** Chatbot'un kullandığı CV bilgilerinin eklenebildiği, düzenlenebildiği, filtrelenebildiği ve yönetilebildiği içerik yönetim ekranı.
- <img width="1901" height="944" alt="image" src="https://github.com/user-attachments/assets/65143091-0dc9-4bd1-90dd-5a5a503d53ae" />

- **Unknown Questions:** Chatbot'un cevaplayamadığı veya bilgi tabanında karşılığı bulunmayan soruların incelendiği ve bilgi tabanına dönüştürülebildiği yönetim ekranı.
-<img width="1883" height="924" alt="image" src="https://github.com/user-attachments/assets/90a4e5de-3c61-4732-8c26-7a4686f0fac5" />

---

## 🚀 Kurulum ve Çalıştırma Adımları

### Ön Gereksinimler
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v18+)](https://nodejs.org/)
- SQL Server (LocalDB veya MSSQL Server)

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/eliffayydnnn/AskElif.git
cd AskElif
```

### 2. Backend Kurulumu ve Çalıştırma

**Windows PowerShell:**
```powershell
cd backend/AskElif.API
Copy-Item appsettings.Example.json appsettings.json
dotnet restore
dotnet run
```

**Linux / macOS (Bash):**
```bash
cd backend/AskElif.API
cp appsettings.Example.json appsettings.json
dotnet restore
dotnet run
```

> **Not:** EF Core veritabanı güncellemeleri için gerekirse `dotnet tool install --global dotnet-ef` komutunu çalıştırabilirsiniz.

Backend `http://localhost:5212` adresinde çalışacaktır. (Swagger UI: `http://localhost:5212/swagger`)

### 3. Frontend Kurulumu ve Çalıştırma
```bash
cd frontend
npm install
npm run dev
```
Frontend `http://localhost:5173` adresinde çalışacaktır.

---

## 🔐 Çevre Değişkenleri ve Güvenlik

Hassas bilgiler (`API Key`, `JWT Secret`, `Connection String`) kaynak kod içerisinde barındırılmaz. Konfigürasyon için `appsettings.Example.json` şablonu kullanılır:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=AskElifDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "YOUR_SUPER_SECRET_JWT_KEY_MIN_32_CHARS_LONG",
    "Issuer": "AskElifAPI",
    "Audience": "AskElifAdmin",
    "ExpireMinutes": 120
  },
  "Gemini": {
    "ApiKey": "YOUR_GEMINI_API_KEY_HERE"
  },
  "Jina": {
    "ApiKey": "YOUR_JINA_API_KEY_HERE"
  }
}
```

> **Güvenlik Notu:** Gerçek API anahtarları `.gitignore` kuralları ile koruma altındadır ve repository geçmişinde duyarlı veri bulunmamaktadır.

---

## 🔮 Gelecek Yol Haritası (Future Roadmap)

- [ ] **Vektör Veritabanı Entegrasyonu:** Qdrant veya PgVector entegrasyonu ile milyonlarca içerik için arama performansı.
- [ ] **Çoklu Dil Desteği (i18n):** İngilizce ve Türkçe dil algılama ve yanıt üretimi.
- [ ] **Karanlık Tema (Dark Mode):** Gece modu arayüz tercihi.

---

**Geliştirici:** Elif Aydın  
**Lisans:** MIT License
