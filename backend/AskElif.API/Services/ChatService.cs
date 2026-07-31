using AskElif.API.Interfaces;

namespace AskElif.API.Services;

public class ChatService : IChatService
{
    public Task<string> AskAsync(string question)
    {
        return Task.FromResult(
            "Henüz OpenAI bağlanmadı. Yakında cevap vereceğim 🙂");
    }
}