using AskElif.API.DTOs;

namespace AskElif.API.Interfaces;

public interface IKnowledgeSearchService
{
    Task<List<KnowledgeSearchResultDto>> SearchAsync(
        string question,
        int topK = 3);
}