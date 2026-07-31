using AskElif.API.DTOs;

namespace AskElif.API.Interfaces;

public interface IKnowledgeService
{
    Task<List<KnowledgeDto>> GetAllAsync();

    Task<KnowledgeDto?> GetByIdAsync(int id);

    Task<KnowledgeDto> CreateAsync(CreateKnowledgeDto dto);

    Task<bool> UpdateAsync(int id, UpdateKnowledgeDto dto);

    Task<bool> DeleteAsync(int id);
}