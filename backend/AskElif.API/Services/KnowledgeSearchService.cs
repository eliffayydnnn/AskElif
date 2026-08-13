using System.Text.Json;
using AskElif.API.DTOs;
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

    public async Task<List<KnowledgeSearchResultDto>> SearchAsync(
        string question,
        int topK = 3)
    {
        // Kullanıcının sorusu için embedding oluştur
        var questionEmbedding =
            await _embeddingService.GenerateEmbeddingAsync(question);

        // Yayındaki ve embedding'i bulunan Knowledge kayıtlarını getir
        var knowledgeItems =
            await _knowledgeRepository.GetPublishedWithEmbeddingsAsync();

        if (!knowledgeItems.Any())
        {
            return new List<KnowledgeSearchResultDto>();
        }

        var results = new List<KnowledgeSearchResultDto>();

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

            results.Add(new KnowledgeSearchResultDto
            {
                Item = item,
                SimilarityScore = score
            });
        }

        // En yüksek similarity skoruna sahip kayıtları seç
        return results
            .OrderByDescending(x => x.SimilarityScore)
            .Take(topK)
            .ToList();
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