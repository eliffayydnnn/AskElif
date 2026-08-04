using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using AskElif.API.Models;

namespace AskElif.API.Services;

public class ChatService : IChatService
{
    private readonly IKnowledgeSearchService _knowledgeSearchService;
    private readonly IUnknownQuestionRepository _unknownQuestionRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;

    public ChatService(
        IKnowledgeSearchService knowledgeSearchService,
        IUnknownQuestionRepository unknownQuestionRepository,
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository)
    {
        _knowledgeSearchService = knowledgeSearchService;
        _unknownQuestionRepository = unknownQuestionRepository;
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
    }

    public async Task<ChatResultDto> AskAsync(int? conversationId, string question)
    {
        // Conversation oluştur veya mevcut conversation'ı getir
        var conversation = await _conversationRepository.CreateIfNotExistsAsync(conversationId);

        // Kullanıcının mesajını kaydet
        await _messageRepository.AddAsync(new Message
        {
            ConversationId = conversation.Id,
            Role = "User",
            Content = question
        });

        // Bilgi tabanında ara
        var knowledge = await _knowledgeSearchService.SearchAsync(question);

        string answer;
        bool isAnswered;

        if (knowledge != null)
        {
            answer = knowledge.Content;
            isAnswered = true;
        }
        else
        {
            answer = "Bu konuda henüz bilgim bulunmuyor.";
            isAnswered = false;

            await _unknownQuestionRepository.AddAsync(new UnknownQuestion
            {
                Question = question
            });
        }

        // Bot cevabını kaydet
        await _messageRepository.AddAsync(new Message
        {
            ConversationId = conversation.Id,
            Role = "Assistant",
            Content = answer
        });

        return new ChatResultDto
        {
            ConversationId = conversation.Id,
            Answer = answer,
            IsAnswered = isAnswered
        };
    }
}