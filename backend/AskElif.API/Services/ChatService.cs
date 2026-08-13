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

        // Semantic search ile en alakalı Knowledge kayıtlarını getir
        var searchResults =
            await _knowledgeSearchService.SearchAsync(
                question,
                3);

        // Minimum similarity threshold
        const double minimumSimilarity = 0.60;

        // Yeterince güçlü eşleşme var mı?
        var relevantResults = searchResults
            .Where(x => x.SimilarityScore >= minimumSimilarity)
            .ToList();

        string answer;
        bool isAnswered;

        if (relevantResults.Any())
        {
            // Gemini'ye birden fazla Knowledge bilgisini gönderiyoruz.
            var knowledgeContext = string.Join(
                "\n\n",
                relevantResults.Select((result, index) => $"""
                    --- Bilgi {index + 1} ---

                    Başlık:
                    {result.Item.Title}

                    Kategori:
                    {result.Item.Category}

                    İçerik:
                    {result.Item.Content}

                    Kaynak:
                    {result.Item.Source}

                    Etiketler:
                    {result.Item.Tags}

                    Benzerlik Skoru:
                    {result.SimilarityScore:F3}
                    """));

            var prompt = $"""
                Sen AskElif isimli bir CV ve kariyer chatbotusun.

                Aşağıdaki bilgiler Elif Aydın'ın CV'sinden,
                projelerinden ve kariyer bilgilerinden alınmıştır.

                SADECE aşağıdaki bilgilerden yararlanarak cevap ver.

                Eğer sorunun cevabı verilen bilgilerde yoksa,
                kesinlikle bilgi uydurma.

                --- KNOWLEDGE ---

                {knowledgeContext}

                --- KULLANICININ SORUSU ---

                {question}

                --- KURALLAR ---

                - Sadece verilen Knowledge bilgilerini kullan.
                - Bilgi verilen içerikte yoksa tahmin etme.
                - Kendi genel bilgini kullanarak Elif hakkında bilgi üretme.
                - Doğal ve profesyonel Türkçe kullan.
                - Gereksiz uzun cevap verme.
                - Sorunun cevabı birden fazla Knowledge kaydında bulunuyorsa
                  bu bilgileri birleştirerek cevap ver.
                - Kullanıcı açıkça Elif hakkında soruyorsa,
                  üçüncü şahıs kullanabilirsin.
                """;

            answer =
                await _geminiService.GenerateAsync(prompt);

            isAnswered = true;
        }
        else
        {
            // Yeterli semantic eşleşme bulunamadı.
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