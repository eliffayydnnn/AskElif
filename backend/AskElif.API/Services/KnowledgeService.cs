using System.Text.Json;
using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using AskElif.API.Models;

namespace AskElif.API.Services;

public class KnowledgeService : IKnowledgeService
{
    private readonly IKnowledgeRepository _repository;
    private readonly IEmbeddingService _embeddingService;

    public KnowledgeService(
        IKnowledgeRepository repository,
        IEmbeddingService embeddingService)
    {
        _repository = repository;
        _embeddingService = embeddingService;
    }

    public async Task<List<KnowledgeDto>> GetAllAsync()
    {
        var items = await _repository.GetAllAsync();

        return items.Select(item => new KnowledgeDto
        {
            Id = item.Id,
            Title = item.Title,
            Category = item.Category,
            Content = item.Content,
            Source = item.Source,
            Tags = item.Tags,
            Priority = item.Priority,
            IsPublished = item.IsPublished,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        }).ToList();
    }

    public async Task<KnowledgeDto?> GetByIdAsync(int id)
    {
        var item = await _repository.GetByIdAsync(id);

        if (item == null)
            return null;

        return new KnowledgeDto
        {
            Id = item.Id,
            Title = item.Title,
            Category = item.Category,
            Content = item.Content,
            Source = item.Source,
            Tags = item.Tags,
            Priority = item.Priority,
            IsPublished = item.IsPublished,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };
    }

    public async Task<KnowledgeDto> CreateAsync(CreateKnowledgeDto dto)
    {
        var item = new KnowledgeItem
        {
            Title = dto.Title,
            Category = dto.Category,
            Content = dto.Content,
            Source = dto.Source,
            Tags = dto.Tags,
            Priority = dto.Priority,
            IsPublished = dto.IsPublished
        };

        // Embedding için aranabilir metni oluştur
        var textForEmbedding = BuildEmbeddingText(item);

        // Jina'dan embedding oluştur
        var embedding =
            await _embeddingService.GenerateEmbeddingAsync(
                textForEmbedding);

        // Embedding'i JSON olarak kaydet
        item.Embedding =
            JsonSerializer.Serialize(embedding);

        // Knowledge + embedding birlikte kaydedilir
        await _repository.AddAsync(item);

        return MapToDto(item);
    }

    public async Task<bool> UpdateAsync(
        int id,
        UpdateKnowledgeDto dto)
    {
        var item = await _repository.GetByIdAsync(id);

        if (item == null)
            return false;

        item.Title = dto.Title;
        item.Category = dto.Category;
        item.Content = dto.Content;
        item.Source = dto.Source;
        item.Tags = dto.Tags;
        item.Priority = dto.Priority;
        item.IsPublished = dto.IsPublished;
        item.UpdatedAt = DateTime.UtcNow;

        // İçerik değiştiği için embedding'i yeniden oluştur
        var textForEmbedding = BuildEmbeddingText(item);

        var embedding =
            await _embeddingService.GenerateEmbeddingAsync(
                textForEmbedding);

        item.Embedding =
            JsonSerializer.Serialize(embedding);

        await _repository.UpdateAsync(item);

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _repository.GetByIdAsync(id);

        if (item == null)
            return false;

        await _repository.DeleteAsync(item);

        return true;
    }

    private static string BuildEmbeddingText(
        KnowledgeItem item)
    {
        return $"""
            Başlık: {item.Title}

            Kategori: {item.Category}

            İçerik: {item.Content}

            Kaynak: {item.Source}

            Etiketler: {item.Tags}
            """;
    }

    private static KnowledgeDto MapToDto(
        KnowledgeItem item)
    {
        return new KnowledgeDto
        {
            Id = item.Id,
            Title = item.Title,
            Category = item.Category,
            Content = item.Content,
            Source = item.Source,
            Tags = item.Tags,
            Priority = item.Priority,
            IsPublished = item.IsPublished,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };
    }
}