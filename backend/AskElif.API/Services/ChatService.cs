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
    private readonly GeminiService _geminiService;

    public ChatService(
        IKnowledgeSearchService knowledgeSearchService,
        IUnknownQuestionRepository unknownQuestionRepository,
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository,
        GeminiService geminiService)
    {
        _knowledgeSearchService = knowledgeSearchService;
        _unknownQuestionRepository = unknownQuestionRepository;
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _geminiService = geminiService;
    }

    public async Task<ChatResultDto> AskAsync(
        int? conversationId,
        string question)
    {
        // Conversation oluştur veya mevcut conversation'ı getir
        var conversation =
            await _conversationRepository.CreateIfNotExistsAsync(
                conversationId);

        // Kullanıcının mesajını kaydet
        await _messageRepository.AddAsync(new Message
        {
            ConversationId = conversation.Id,
            Role = "User",
            Content = question
        });

        // Semantic search ile en alakalı bilgiyi bul
        var knowledge =
            await _knowledgeSearchService.SearchAsync(question);

        string answer;
        bool isAnswered;

        if (knowledge != null)
        {
            // Knowledge bulundu.
            // Gemini'ye sadece bulunan CV bilgisini veriyoruz.

            var prompt = $"""
                Sen AskElif isimli bir CV ve kariyer chatbotusun.

                Aşağıdaki bilgi Elif'in CV'sinden alınmıştır:

                ---
                Başlık:
                {knowledge.Title}

                Kategori:
                {knowledge.Category}

                İçerik:
                {knowledge.Content}

                Etiketler:
                {knowledge.Tags}

                Kaynak:
                {knowledge.Source}
                ---

                Kullanıcının sorusu:
                {question}

                Kurallar:
                - Sadece verilen CV bilgilerini kullan.
                - Verilen bilgilerde olmayan bir şeyi uydurma.
                - Kullanıcıya doğal ve profesyonel Türkçe ile cevap ver.
                - Cevabı gereksiz yere uzatma.
                - Sorunun cevabı verilen bilgilerde varsa doğrudan cevapla.
                """;

            answer =
                await _geminiService.GenerateAsync(prompt);

            isAnswered = true;
        }
        else
        {
            answer =
                "Bu konuda henüz bilgim bulunmuyor.";

            isAnswered = false;

            // Cevaplanamayan soruyu kaydet
            await _unknownQuestionRepository.AddAsync(
                new UnknownQuestion
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