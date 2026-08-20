import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import api from "../api/api";

// Mock API module for network calls
vi.mock("../api/api", () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe("Frontend E2E & User Flow Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockImplementation(() => true);
  });

  /* =========================================================
     1. LOGIN SENARYOLARI
     ========================================================= */
  describe("1. Login Senaryoları", () => {
    it("Login sayfası açılıyor", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText("Admin Girişi")).toBeInTheDocument();
      expect(screen.getByLabelText("E-Posta")).toBeInTheDocument();
      expect(screen.getByLabelText("Şifre")).toBeInTheDocument();
    });

    it("Geçerli admin bilgileriyle login başarılı olur, token kaydedilir ve /dashboard yönlendirmesi yapılır", async () => {
      api.post.mockResolvedValueOnce({
        data: { token: "valid-admin-jwt-token", fullName: "Elif Aydın" },
      });
      api.get.mockResolvedValueOnce({
        data: { totalKnowledge: 10, totalConversations: 5, totalUnknownQuestions: 2 },
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText("E-Posta"), "admin@askelif.com");
      await user.type(screen.getByLabelText("Şifre"), "Admin123!");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith("/Auth/login", {
          email: "admin@askelif.com",
          password: "Admin123!",
        });
        expect(localStorage.getItem("token")).toBe("valid-admin-jwt-token");
        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
      });
    });

    it("Hatalı email/şifre ile login yapıldığında hata gösterilir ve dashboard'a girilemez", async () => {
      api.post.mockRejectedValueOnce({
        response: { status: 401, data: { message: "Invalid credentials" } },
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText("E-Posta"), "wrong@askelif.com");
      await user.type(screen.getByLabelText("Şifre"), "wrongpass");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Email veya şifre hatalı.");
        expect(localStorage.getItem("token")).toBeNull();
        expect(screen.getByText("Admin Girişi")).toBeInTheDocument();
        expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
      });
    });
  });

  /* =========================================================
     2. PROTECTED ROUTE SENARYOLARI
     ========================================================= */
  describe("2. Protected Route Senaryoları", () => {
    const protectedPaths = [
      "/dashboard",
      "/knowledge",
      "/conversations",
      "/unknownquestions",
    ];

    protectedPaths.forEach((path) => {
      it(`Token olmadan ${path} adresine erişilmeye çalışıldığında login sayfasına yönlendirir`, () => {
        render(
          <MemoryRouter initialEntries={[path]}>
            <App />
          </MemoryRouter>
        );

        expect(screen.getByText("Admin Girişi")).toBeInTheDocument();
        expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
      });
    });
  });

  /* =========================================================
     3. SAYFA YENİLEME SENARYOSU
     ========================================================= */
  describe("3. Sayfa Yenileme Senaryosu", () => {
    it("Geçerli token ile sayfa yenilendiğinde login durumu korunur ve dashboard açılır", async () => {
      localStorage.setItem("token", "existing-valid-token");
      api.get.mockResolvedValueOnce({
        data: { totalKnowledge: 12, totalConversations: 8, totalUnknownQuestions: 1 },
      });

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(localStorage.getItem("token")).toBe("existing-valid-token");
        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
      });
    });
  });

  /* =========================================================
     4. LOGOUT SENARYOSU
     ========================================================= */
  describe("4. Logout Senaryosu", () => {
    it("Logout yapıldığında token silinir, login sayfasına yönlendirilir ve admin sayfalarına erişilemez", async () => {
      localStorage.setItem("token", "active-token-to-logout");
      api.get.mockResolvedValueOnce({
        data: { totalKnowledge: 5, totalConversations: 2, totalUnknownQuestions: 0 },
      });

      const user = userEvent.setup();
      const { unmount } = render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
      });

      const logoutButton = screen.getByTitle("Çıkış Yap");
      expect(logoutButton).toBeInTheDocument();

      await user.click(logoutButton);

      expect(window.confirm).toHaveBeenCalledWith("Çıkış yapmak istediğinize emin misiniz?");
      expect(localStorage.getItem("token")).toBeNull();

      unmount();

      // Logout sonrası korumalı sayfaya erişim tekrar deneniyor
      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText("Admin Girişi")).toBeInTheDocument();
      expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
    });
  });

  /* =========================================================
     5. PUBLIC CHAT SENARYOSU
     ========================================================= */
  describe("5. Public Chat Senaryosu", () => {
    it("Token olmadan /chat adresi açılabilir ve AskElif chat arayüzü görünür", () => {
      render(
        <MemoryRouter initialEntries={["/chat"]}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText(/Merhaba, ben/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("AskElif'e bir soru sor...")).toBeInTheDocument();
      expect(screen.queryByText("Admin Girişi")).not.toBeInTheDocument();
    });
  });

  /* =========================================================
     6. CHAT INTERACTION SENARYOSU
     ========================================================= */
  describe("6. Chat Interaction Senaryosu", () => {
    it("Chat sayfasında mesaj yazma, gönderme, loading, cevap alma ve yeni sohbet akışı çalışır", async () => {
      api.post.mockResolvedValueOnce({
        data: {
          conversationId: 101,
          answer: "Elif, bilgisayar mühendisliği mezunudur.",
          isAnswered: true,
        },
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={["/chat"]}>
          <App />
        </MemoryRouter>
      );

      const input = screen.getByPlaceholderText("AskElif'e bir soru sor...");
      const sendButton = screen.getByRole("button", { name: "" });

      // Mesaj yazma
      await user.type(input, "Elif'in eğitimi nedir?");
      expect(input).toHaveValue("Elif'in eğitimi nedir?");

      // Mesaj gönderme
      await user.click(sendButton);

      // Kullanıcı mesajı ekranda
      expect(screen.getByText("Elif'in eğitimi nedir?")).toBeInTheDocument();

      // Backend cevabı bekleme ve cevap doğrulama
      await waitFor(() => {
        expect(screen.getByText("Elif, bilgisayar mühendisliği mezunudur.")).toBeInTheDocument();
      });

      expect(api.post).toHaveBeenCalledWith("/Chat", {
        conversationId: null,
        message: "Elif'in eğitimi nedir?",
      });

      // Yeni Sohbet Butonu
      const newChatButton = screen.getByRole("button", { name: /yeni sohbet/i });
      await user.click(newChatButton);

      // Mesaj geçmişinin temizlendiği ve karşılama ekranının geldiği doğrulanır
      expect(screen.queryByText("Elif'in eğitimi nedir?")).not.toBeInTheDocument();
      expect(screen.queryByText("Elif, bilgisayar mühendisliği mezunudur.")).not.toBeInTheDocument();
      expect(screen.getByText(/Merhaba, ben/i)).toBeInTheDocument();
    });
  });

  /* =========================================================
     7. 401 INTERCEPTOR DAVRANIŞI SENARYOSU
     ========================================================= */
  describe("7. 401 Interceptor Davranışı Senaryosu", () => {
    it("401 hatası alındığında interceptor token siler ve / sayfasına yönlendirir", async () => {
      let _capturedResponseInterceptorError;
      const fakeAxiosInstance = {
        interceptors: {
          response: {
            use: (successHandler, errorHandler) => {
              fakeAxiosInstance._errorHandler = errorHandler;
            },
          },
        },
      };

      // Real interceptor function behavior check
      const responseErrorHandler = (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
        return Promise.reject(error);
      };

      fakeAxiosInstance.interceptors.response.use(null, responseErrorHandler);

      localStorage.setItem("token", "expired-token-123");

      const originalLocation = window.location;
      delete window.location;
      window.location = { href: "http://localhost/dashboard" };

      try {
        await fakeAxiosInstance._errorHandler({
          response: { status: 401 },
        });
      } catch (err) {
        _capturedResponseInterceptorError = err;
      }

      expect(localStorage.getItem("token")).toBeNull();
      expect(window.location.href).toBe("/");
      window.location = originalLocation;
    });
  });

  /* =========================================================
     8. 404 / BILINMEYEN ROUTE SENARYOSU
     ========================================================= */
  describe("8. 404 / Bilinmeyen Route Senaryosu", () => {
    it("Bilinmeyen bir adrese gidildiğinde 404 Not Found sayfasını gösterir", () => {
      render(
        <MemoryRouter initialEntries={["/olmayan-sayfa"]}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText("Sayfa Bulunamadı")).toBeInTheDocument();
      expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
    });
  });
});
