using AskElif.API.Models;

namespace AskElif.API.Interfaces;

public interface IKnowledgeSearchService
{
    Task<List<KnowledgeItem>> SearchAsync(string question);
}