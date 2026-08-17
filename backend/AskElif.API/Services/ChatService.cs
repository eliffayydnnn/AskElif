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

    // Semantic search için minimum eşleşme
    private const double MinimumSimilarity = 0.45;

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
        // =========================================
        // CONVERSATION
        // =========================================

        var conversation =
            await _conversationRepository.CreateIfNotExistsAsync(
                conversationId);

        // =========================================
        // USER MESAJINI KAYDET
        // =========================================

        await _messageRepository.AddAsync(
            new Message
            {
                ConversationId = conversation.Id,
                Role = "User",
                Content = question
            });

        // =========================================
        // KNOWLEDGE SEARCH
        // =========================================

        var searchResults =
            await _knowledgeSearchService.SearchAsync(
                question,
                3);

        Console.WriteLine();
        Console.WriteLine("===== SEMANTIC SEARCH =====");

        foreach (var result in searchResults)
        {
            Console.WriteLine(
                $"Title: {result.Item.Title} | " +
                $"Score: {result.SimilarityScore:F4}");
        }

        Console.WriteLine("===========================");
        Console.WriteLine();

        // =========================================
        // RELEVANT RESULTS
        // =========================================

        var relevantResults = searchResults
            .Where(x =>
                x.SimilarityScore >= MinimumSimilarity)
            .OrderByDescending(x => x.SimilarityScore)
            .ToList();

        // =========================================
        // KNOWLEDGE BULUNAMADI
        // =========================================

        if (!relevantResults.Any())
        {
            const string unknownAnswer =
                "Bu konuda henüz bilgim bulunmuyor.";

            await SaveUnknownQuestion(question);

            await _messageRepository.AddAsync(
                new Message
                {
                    ConversationId = conversation.Id,
                    Role = "Assistant",
                    Content = unknownAnswer
                });

            return new ChatResultDto
            {
                ConversationId = conversation.Id,
                Answer = unknownAnswer,
                IsAnswered = false
            };
        }

        // =========================================
        // KNOWLEDGE CONTEXT
        // =========================================

        var knowledgeContext =
            string.Join(
                "\n\n",
                relevantResults.Select(
                    (result, index) => $"""
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
                    """));

        // =========================================
        // GEMINI
        // =========================================

        var prompt = $"""
            Sen AskElif isimli bir CV ve kariyer chatbotusun.

            Aşağıdaki bilgiler Elif Aydın'ın CV'sinden,
            projelerinden, eğitiminden, yeteneklerinden
            ve kişisel bilgilerinden alınmıştır.

            SADECE aşağıdaki Knowledge bilgilerini kullan.

            Eğer kullanıcının sorusunun cevabı bu bilgilerde
            bulunmuyorsa kesinlikle bilgi uydurma.

            --- KNOWLEDGE ---

            {knowledgeContext}

            --- KULLANICININ SORUSU ---

            {question}

            --- KURALLAR ---

            - Sadece verilen Knowledge bilgilerini kullan.
            - Knowledge içerisinde olmayan bilgileri tahmin etme.
            - Elif hakkında kendi genel bilgini kullanma.
            - Bilgi sorunun cevabını doğrudan içermiyorsa
              "Bu konuda henüz bilgim bulunmuyor." de.
            - Doğal ve profesyonel Türkçe kullan.
            - Gereksiz uzun cevap verme.
            - Kullanıcı Türkçe soruyorsa Türkçe cevap ver.
            - Kullanıcı açıkça Elif hakkında soruyorsa
              üçüncü şahıs kullanabilirsin.

            Cevabı sadece kullanıcıya gösterilecek şekilde üret.
            """;

        var answer =
            await _geminiService.GenerateAsync(prompt);

        // =========================================
        // BOŞ CEVAP KONTROLÜ
        // =========================================

        if (string.IsNullOrWhiteSpace(answer))
        {
            answer =
                "Üzgünüm, şu anda bu soruya cevap oluşturamadım.";
        }

        // =========================================
        // BOT MESAJINI KAYDET
        // =========================================

        await _messageRepository.AddAsync(
            new Message
            {
                ConversationId = conversation.Id,
                Role = "Assistant",
                Content = answer
            });

        // =========================================
        // SONUÇ
        // =========================================

        return new ChatResultDto
        {
            ConversationId = conversation.Id,
            Answer = answer,
            IsAnswered = true
        };
    }

    // =========================================
    // UNKNOWN QUESTION
    // =========================================

    private async Task SaveUnknownQuestion(
        string question)
    {
        await _unknownQuestionRepository.AddAsync(
            new UnknownQuestion
            {
                Question = question,
                IsResolved = false
            });

        Console.WriteLine(
            $"Unknown Question kaydedildi: {question}");
    }
}