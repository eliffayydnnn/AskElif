using AskElif.API.Models;

namespace AskElif.API.Interfaces;

public interface IKnowledgeRepository
{
    Task<List<KnowledgeItem>> GetAllAsync();

    Task<List<KnowledgeItem>> GetPublishedAsync();
    
    Task<List<KnowledgeItem>> GetPublishedWithEmbeddingsAsync();

    Task<KnowledgeItem?> GetByIdAsync(int id);

    Task<List<KnowledgeItem>> SearchAsync(string question);

    Task AddAsync(KnowledgeItem knowledgeItem);

    Task UpdateAsync(KnowledgeItem knowledgeItem);

    Task DeleteAsync(KnowledgeItem knowledgeItem);
}