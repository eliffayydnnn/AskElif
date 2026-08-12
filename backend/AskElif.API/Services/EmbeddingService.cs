using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using AskElif.API.Interfaces;

namespace AskElif.API.Services;

public class EmbeddingService : IEmbeddingService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public EmbeddingService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<float[]> GenerateEmbeddingAsync(string text)
    {
        var apiKey = _configuration["Jina:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException(
                "Jina API key bulunamadı.");
        }

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.jina.ai/v1/embeddings");

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);

        var body = new
        {
            model = "jina-embeddings-v3",
            input = new[] { text }
        };

        var json = JsonSerializer.Serialize(body);

        request.Content = new StringContent(
            json,
            Encoding.UTF8,
            "application/json");

        var response = await _httpClient.SendAsync(request);

        var responseContent =
            await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception(
                $"Jina Embedding API hatası: {response.StatusCode} - {responseContent}");
        }

        using var document =
            JsonDocument.Parse(responseContent);

        var embedding =
            document.RootElement
                .GetProperty("data")[0]
                .GetProperty("embedding");

        return embedding
            .EnumerateArray()
            .Select(x => x.GetSingle())
            .ToArray();
    }
}