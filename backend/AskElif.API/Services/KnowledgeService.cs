using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using AskElif.API.Models;

namespace AskElif.API.Services;

public class KnowledgeService : IKnowledgeService
{
    private readonly IKnowledgeRepository _repository;

    public KnowledgeService(IKnowledgeRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<KnowledgeDto>> GetAllAsync()
    {
        var items = await _repository.GetAllAsync();

        return items.Select(x => new KnowledgeDto
        {
            Id = x.Id,
            Title = x.Title,
            Category = x.Category,
            Content = x.Content,
            Source = x.Source,
            Tags = x.Tags,
            Priority = x.Priority,
            IsPublished = x.IsPublished,
            CreatedAt = x.CreatedAt,
            UpdatedAt = x.UpdatedAt
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

        await _repository.AddAsync(item);

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

    public async Task<bool> UpdateAsync(int id, UpdateKnowledgeDto dto)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }
}