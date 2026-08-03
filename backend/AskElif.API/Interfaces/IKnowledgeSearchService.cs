using AskElif.API.Models;

namespace AskElif.API.Interfaces;

public interface IKnowledgeSearchService
{
    Task<KnowledgeItem?> SearchAsync(string question);
}