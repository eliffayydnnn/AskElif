using AskElif.API.Interfaces;
using AskElif.API.Models;

namespace AskElif.API.Services;

public class KnowledgeSearchService : IKnowledgeSearchService
{
    private readonly IKnowledgeRepository _knowledgeRepository;

    public KnowledgeSearchService(IKnowledgeRepository knowledgeRepository)
    {
        _knowledgeRepository = knowledgeRepository;
    }

    public async Task<KnowledgeItem?> SearchAsync(string question)
    {
        return await _knowledgeRepository.SearchAsync(question);
    }
}