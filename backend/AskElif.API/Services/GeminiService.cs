using Google.GenAI;
using Google.GenAI.Types;

namespace AskElif.API.Services;

public class GeminiService
{
    private readonly Client _client;

    public GeminiService(IConfiguration configuration)
    {
        var apiKey = configuration["Gemini:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException(
                "Gemini API key bulunamadı.");
        }

        _client = new Client(
            apiKey: apiKey);
    }

    public async Task<string> GenerateAsync(
        string prompt)
    {
        var response =
            await _client.Models.GenerateContentAsync(
                model: "gemini-3.6-flash",
                contents: prompt);

        return response.Text?.Trim()
               ?? string.Empty;
    }
} 