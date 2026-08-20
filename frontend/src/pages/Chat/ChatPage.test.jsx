import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatPage from "./ChatPage";

const mockPost = vi.fn();

vi.mock("../../api/api", () => ({
  default: {
    post: (...args) => mockPost(...args),
  },
}));

describe("ChatPage", () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it("boş mesaj gönderilemez", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const sendButton = screen.getByRole("button", { name: "" });
    expect(sendButton).toBeDisabled();

    await user.type(screen.getByPlaceholderText("AskElif'e bir soru sor..."), "   ");
    expect(sendButton).toBeDisabled();
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("mesaj gönderildiğinde loading gösterir ve cevabı ekler", async () => {
    mockPost.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: {
                conversationId: 42,
                answer: "Merhaba, ben AskElif.",
                isAnswered: true,
              },
            });
          }, 50);
        })
    );

    const user = userEvent.setup();
    render(<ChatPage />);

    const input = screen.getByPlaceholderText("AskElif'e bir soru sor...");
    await user.type(input, "Merhaba");
    await user.click(screen.getByRole("button", { name: "" }));

    expect(screen.getByText("Merhaba")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Merhaba, ben AskElif.")).toBeInTheDocument();
    });

    expect(mockPost).toHaveBeenCalledWith("/Chat", {
      conversationId: null,
      message: "Merhaba",
    });
  });

  it("hata durumunda hata mesajı gösterir", async () => {
    mockPost.mockRejectedValue({
      response: { data: { message: "Chat sırasında bir hata oluştu." } },
    });

    const user = userEvent.setup();
    render(<ChatPage />);

    await user.type(
      screen.getByPlaceholderText("AskElif'e bir soru sor..."),
      "Test sorusu"
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() => {
      expect(
        screen.getByText("Chat sırasında bir hata oluştu.")
      ).toBeInTheDocument();
    });
  });

  it("yeni sohbet conversationId ve mesajları sıfırlar", async () => {
    mockPost.mockResolvedValue({
      data: {
        conversationId: 99,
        answer: "Cevap",
        isAnswered: true,
      },
    });

    const user = userEvent.setup();
    render(<ChatPage />);

    await user.type(
      screen.getByPlaceholderText("AskElif'e bir soru sor..."),
      "İlk soru"
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() => {
      expect(screen.getByText("Cevap")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /yeni sohbet/i }));

    expect(screen.queryByText("İlk soru")).not.toBeInTheDocument();
    expect(screen.getByText(/Merhaba, ben/)).toBeInTheDocument();
  });

  it("aynı conversationId korunarak ikinci mesaj gönderilir", async () => {
    mockPost
      .mockResolvedValueOnce({
        data: {
          conversationId: 7,
          answer: "İlk cevap",
          isAnswered: true,
        },
      })
      .mockResolvedValueOnce({
        data: {
          conversationId: 7,
          answer: "İkinci cevap",
          isAnswered: true,
        },
      });

    const user = userEvent.setup();
    render(<ChatPage />);

    const input = screen.getByPlaceholderText("AskElif'e bir soru sor...");

    await user.type(input, "İlk soru");
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() => {
      expect(screen.getByText("İlk cevap")).toBeInTheDocument();
    });

    await user.type(input, "İkinci soru");
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenLastCalledWith("/Chat", {
        conversationId: 7,
        message: "İkinci soru",
      });
    });
  });
});
