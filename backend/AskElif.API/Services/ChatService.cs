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

        // Knowledge tabanında ara
        var knowledgeItems =
            await _knowledgeSearchService.SearchAsync(question);

        string answer;
        bool isAnswered;

        if (knowledgeItems.Any())
        {
            // Bulunan tüm alakalı bilgileri Gemini'ye gönderiyoruz.

            var knowledgeContext = string.Join(
                "\n\n--------------------\n\n",
                knowledgeItems.Select(item => $"""
                    Başlık:
                    {item.Title}

                    Kategori:
                    {item.Category}

                    İçerik:
                    {item.Content}

                    Etiketler:
                    {item.Tags}
                    """));

            var prompt = $"""
                Sen AskElif isimli bir CV ve kariyer chatbotusun.

                Aşağıdaki bilgiler Elif Aydın'ın CV ve kariyer bilgi
                tabanından alınmıştır.

                ====================
                CV BİLGİLERİ
                ====================

                {knowledgeContext}

                ====================
                KULLANICI SORUSU
                ====================

                {question}

                ====================
                KURALLAR
                ====================

                - Sadece yukarıda verilen CV bilgilerini kullan.
                - Verilen bilgilerde olmayan hiçbir bilgiyi uydurma.
                - Sorunun cevabı verilen bilgilerde varsa doğrudan cevapla.
                - Birden fazla bilgi soruyla alakalıysa bunları birlikte kullan.
                - Alakasız bilgileri cevaba dahil etme.
                - Doğal ve profesyonel Türkçe kullan.
                - Cevabı gereksiz yere uzatma.
                - Kullanıcı "kimdir", "hangi teknolojileri biliyor",
                  "hangi projeleri yaptı" gibi genel bir soru sorarsa,
                  verilen alakalı bilgileri anlamlı şekilde birleştir.
                """;

            answer =
                await _geminiService.GenerateAsync(prompt);

            isAnswered = true;
        }
        else
        {
            // Knowledge bulunamadı.
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