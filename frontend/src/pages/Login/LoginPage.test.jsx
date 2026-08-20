import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";

const mockNavigate = vi.fn();
const mockPost = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../api/api", () => ({
  default: {
    post: (...args) => mockPost(...args),
  },
}));

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    mockPost.mockReset();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("doğru login sonrası token kaydeder ve dashboard'a yönlendirir", async () => {
    mockPost.mockResolvedValue({
      data: { token: "jwt-token", fullName: "Elif Aydin" },
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("E-Posta"), "admin@askelif.com");
    await user.type(screen.getByLabelText("Şifre"), "admin123");
    await user.click(screen.getByRole("button", { name: /giriş yap/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("jwt-token");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("yanlış login durumunda hata gösterir", async () => {
    mockPost.mockRejectedValue({
      response: { status: 401 },
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("E-Posta"), "admin@askelif.com");
    await user.type(screen.getByLabelText("Şifre"), "wrong");
    await user.click(screen.getByRole("button", { name: /giriş yap/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Email veya şifre hatalı.");
      expect(localStorage.getItem("token")).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
