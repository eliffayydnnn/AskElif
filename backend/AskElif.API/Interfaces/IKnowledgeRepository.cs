using AskElif.API.Models;

namespace AskElif.API.Interfaces;

public interface IKnowledgeRepository
{
    Task<List<KnowledgeItem>> GetAllAsync();

    Task<KnowledgeItem?> GetByIdAsync(int id);

    Task<KnowledgeItem?> SearchAsync(string question);

    Task AddAsync(KnowledgeItem knowledgeItem);

    Task UpdateAsync(KnowledgeItem knowledgeItem);

    Task DeleteAsync(KnowledgeItem knowledgeItem);
}