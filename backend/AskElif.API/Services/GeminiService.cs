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

    public virtual async Task<string> GenerateAsync(string prompt)
    {
        int maxRetries = 3;
        int delayMs = 1000;

        for (int i = 0; i < maxRetries; i++)
        {
            try
            {
                var response = await _client.Models.GenerateContentAsync(
                    model: "gemini-3.6-flash",
                    contents: prompt);

                return response.Text?.Trim() ?? string.Empty;
            }
            catch (Exception ex) when (i < maxRetries - 1)
            {
                Console.WriteLine($"[GeminiService Warning] Attempt {i + 1} failed: {ex.Message}. Retrying in {delayMs}ms...");
                await Task.Delay(delayMs);
                delayMs *= 2;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GeminiService Fallback] Gemini API temporary error: {ex.Message}");
                return "YES";
            }
        }

        return "YES";
    }
} 