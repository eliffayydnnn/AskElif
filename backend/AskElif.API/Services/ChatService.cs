using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using AskElif.API.Models;

namespace AskElif.API.Services;

public class ChatService : IChatService
{
    private readonly IKnowledgeRepository _knowledgeRepository;
    private readonly IUnknownQuestionRepository _unknownQuestionRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;

    public ChatService(
        IKnowledgeRepository knowledgeRepository,
        IUnknownQuestionRepository unknownQuestionRepository,
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository)
    {
        _knowledgeRepository = knowledgeRepository;
        _unknownQuestionRepository = unknownQuestionRepository;
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
    }

    public async Task<ChatResultDto> AskAsync(int? conversationId, string question)
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
            return new ChatResultDto
            {
                ConversationId = conversationId ?? 0,
                Answer = matchedItem.Content,
                IsAnswered = true
            };
        }

        await _unknownQuestionRepository.AddAsync(new UnknownQuestion
        {
            Question = question
        });

        return new ChatResultDto
        {
            ConversationId = conversationId ?? 0,
            Answer = "Bu konuda henüz bilgim bulunmuyor.",
            IsAnswered = false
        };
    }
}