using System.Text.Json;
using AskElif.API.Interfaces;

namespace AskElif.API.Services;

public class KnowledgeEmbeddingService
{
    private readonly IKnowledgeRepository _knowledgeRepository;
    private readonly IEmbeddingService _embeddingService;

    public KnowledgeEmbeddingService(
        IKnowledgeRepository knowledgeRepository,
        IEmbeddingService embeddingService)
    {
        _knowledgeRepository = knowledgeRepository;
        _embeddingService = embeddingService;
    }

    public async Task GenerateEmbeddingsAsync()
    {
        var knowledgeItems =
            await _knowledgeRepository.GetPublishedAsync();

        foreach (var item in knowledgeItems)
        {
            var text = $"""
                Başlık: {item.Title}
                Kategori: {item.Category}
                İçerik: {item.Content}
                Etiketler: {item.Tags}
                Kaynak: {item.Source}
                """;

            var embedding =
                await _embeddingService.GenerateEmbeddingAsync(text);

            item.Embedding =
                JsonSerializer.Serialize(embedding);

            await _knowledgeRepository.UpdateAsync(item);
        }
    }
}