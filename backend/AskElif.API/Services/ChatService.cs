using AskElif.API.Interfaces;
using AskElif.API.Models;

namespace AskElif.API.Services;

public class ChatService : IChatService
{
    private readonly IKnowledgeRepository _knowledgeRepository;
    private readonly IUnknownQuestionRepository _unknownQuestionRepository;

    public ChatService(
        IKnowledgeRepository knowledgeRepository,
        IUnknownQuestionRepository unknownQuestionRepository)
    {
        _knowledgeRepository = knowledgeRepository;
        _unknownQuestionRepository = unknownQuestionRepository;
    }

    public async Task<string> AskAsync(string question)
    {
        var knowledgeItems = await _knowledgeRepository.GetAllAsync();

        var lowerQuestion = question.ToLower();

        var matchedItem = knowledgeItems
            .Where(x =>
                x.IsPublished &&
                (
                    x.Title.ToLower().Contains(lowerQuestion) ||
                    x.Category.ToLower().Contains(lowerQuestion) ||
                    x.Content.ToLower().Contains(lowerQuestion) ||
                    x.Tags.ToLower().Contains(lowerQuestion)
                ))
            .OrderByDescending(x => x.Priority)
            .FirstOrDefault();

        if (matchedItem != null)
        {
            return matchedItem.Content;
        }

        await _unknownQuestionRepository.AddAsync(new UnknownQuestion
        {
            Question = question
        });

        return "Bu konuda henüz bilgim bulunmuyor.";
    }
}