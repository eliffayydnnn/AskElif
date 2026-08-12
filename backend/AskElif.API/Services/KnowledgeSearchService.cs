using System.Text.Json;
using AskElif.API.Interfaces;
using AskElif.API.Models;

namespace AskElif.API.Services;

public class KnowledgeSearchService : IKnowledgeSearchService
{
    private readonly IKnowledgeRepository _knowledgeRepository;
    private readonly IEmbeddingService _embeddingService;

    public KnowledgeSearchService(
        IKnowledgeRepository knowledgeRepository,
        IEmbeddingService embeddingService)
    {
        _knowledgeRepository = knowledgeRepository;
        _embeddingService = embeddingService;
    }

    public async Task<KnowledgeItem?> SearchAsync(string question)
    {
        // Kullanıcının sorusu için embedding oluştur
        var questionEmbedding =
            await _embeddingService.GenerateEmbeddingAsync(question);

        // Embedding'i bulunan yayınlanmış bilgileri getir
        var knowledgeItems =
            await _knowledgeRepository.GetPublishedWithEmbeddingsAsync();

        if (!knowledgeItems.Any())
        {
            return await GetKeywordFallbackAsync(question);
        }

        KnowledgeItem? bestItem = null;
        double bestScore = 0;

        foreach (var item in knowledgeItems)
        {
            if (string.IsNullOrWhiteSpace(item.Embedding))
                continue;

            var itemEmbedding =
                JsonSerializer.Deserialize<float[]>(item.Embedding);

            if (itemEmbedding == null)
                continue;

            var score = CosineSimilarity(
                questionEmbedding,
                itemEmbedding);

            if (score > bestScore)
            {
                bestScore = score;
                bestItem = item;
            }
        }

        // Semantic search için minimum güven eşiği.
        const double minimumSimilarity = 0.60;

        // Yeterince güçlü eşleşme yoksa
        // doğrudan "knowledge yok" kabul ediyoruz.
        if (bestItem == null || bestScore < minimumSimilarity)
        {
            return null;
        }

        return bestItem;
    }

    private async Task<KnowledgeItem?> GetKeywordFallbackAsync(
        string question)
    {
        var fallbackResults =
            await _knowledgeRepository.SearchAsync(question);

        return fallbackResults.FirstOrDefault();
    }

    private static double CosineSimilarity(
        float[] vectorA,
        float[] vectorB)
    {
        if (vectorA.Length != vectorB.Length)
            return 0;

        double dotProduct = 0;
        double magnitudeA = 0;
        double magnitudeB = 0;

        for (int i = 0; i < vectorA.Length; i++)
        {
            dotProduct +=
                vectorA[i] * vectorB[i];

            magnitudeA +=
                vectorA[i] * vectorA[i];

            magnitudeB +=
                vectorB[i] * vectorB[i];
        }

        if (magnitudeA == 0 || magnitudeB == 0)
            return 0;

        return dotProduct /
               (Math.Sqrt(magnitudeA) *
                Math.Sqrt(magnitudeB));
    }
}