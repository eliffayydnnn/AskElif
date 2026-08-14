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

    // Similarity değerleri
    private const double MinimumSimilarity = 0.45;
    private const double StrongSimilarity = 0.80;

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

        await _messageRepository.AddAsync(new Message
        {
            ConversationId = conversation.Id,
            Role = "User",
            Content = question
        });

        // =========================================
        // SEMANTIC SEARCH
        // =========================================

        var searchResults =
            await _knowledgeSearchService.SearchAsync(
                question,
                3);

        Console.WriteLine();
        Console.WriteLine("===== SEMANTIC SEARCH RESULTS =====");

        foreach (var result in searchResults)
        {
            Console.WriteLine(
                $"Title: {result.Item.Title} | " +
                $"Score: {result.SimilarityScore:F4}");
        }

        Console.WriteLine("===================================");
        Console.WriteLine();

        // =========================================
        // YETERLİ EŞLEŞME VAR MI?
        // =========================================

        var relevantResults = searchResults
            .Where(x =>
                x.SimilarityScore >= MinimumSimilarity)
            .ToList();

        string answer;
        bool isAnswered;

        // =========================================
        // HİÇBİR KNOWLEDGE UYGUN DEĞİLSE
        // =========================================

        if (!relevantResults.Any())
        {
            answer =
                "Bu konuda henüz bilgim bulunmuyor.";

            isAnswered = false;

            await SaveUnknownQuestion(question);
        }
        else
        {
            // =========================================
            // EN İYİ SONUCU BUL
            // =========================================

            var bestResult =
                relevantResults
                    .OrderByDescending(x => x.SimilarityScore)
                    .First();

            Console.WriteLine(
                $"===== BEST KNOWLEDGE =====");

            Console.WriteLine(
                $"Title: {bestResult.Item.Title}");

            Console.WriteLine(
                $"Score: {bestResult.SimilarityScore:F4}");

            Console.WriteLine(
                "==========================");

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

                            Benzerlik Skoru:
                            {result.SimilarityScore:F3}
                            """));

            // =========================================
            // GÜÇLÜ EŞLEŞME
            // =========================================
            //
            // Similarity >= 0.80 ise Gemini'ye:
            //
            // "Bu bilgi soruyu gerçekten cevaplıyor mu?"
            //
            // diye ayrıca sormuyoruz.
            //
            // Direkt cevap üretmeye geçiyoruz.
            // Böylece Gemini çağrısı 2 yerine 1 oluyor.
            // =========================================

            if (bestResult.SimilarityScore >= StrongSimilarity)
            {
                Console.WriteLine(
                    "===== STRONG MATCH =====");

                Console.WriteLine(
                    "Gemini relevance kontrolü atlandı.");

                Console.WriteLine(
                    "Direkt cevap üretilecek.");

                Console.WriteLine(
                    "========================");
            }
            else
            {
                // =========================================
                // ORTA SEVİYE EŞLEŞME
                // =========================================
                //
                // 0.45 - 0.80 arasındaysa Gemini'ye
                // gerçekten cevap var mı diye soruyoruz.
                // =========================================

                Console.WriteLine(
                    "===== MEDIUM MATCH =====");

                Console.WriteLine(
                    "Gemini relevance kontrolü yapılacak.");

                Console.WriteLine(
                    "========================");

                var relevancePrompt = $"""
                    Sen AskElif isimli bir CV chatbotunun
                    bilgi kontrol sistemisin.

                    Kullanıcının sorusu:

                    "{question}"

                    Aşağıdaki Knowledge kayıtları
                    Elif Aydın hakkında bilgi içermektedir:

                    --- KNOWLEDGE ---

                    {knowledgeContext}

                    --- GÖREV ---

                    Knowledge kayıtlarını dikkatlice incele.

                    Kullanıcının sorusunun cevabı bu bilgilerde
                    gerçekten bulunuyor mu?

                    Eğer cevap açıkça veya doğrudan
                    bu bilgilerden çıkarılabiliyorsa sadece:

                    YES

                    yaz.

                    Eğer cevap bilgilerde bulunmuyorsa veya
                    sadece konu olarak benzer bir bilgi varsa:

                    NO

                    yaz.

                    Örnek:

                    Soru:
                    "Elif'in en sevdiği tatlı nedir?"

                    Knowledge:
                    "Elif'in en sevdiği yemek mantıdır."

                    Bu durumda cevap tatlı hakkında olmadığı için:

                    NO

                    yaz.

                    Sadece YES veya NO yaz.
                    """;

                var relevanceResult =
                    await _geminiService.GenerateAsync(
                        relevancePrompt);

                var isRelevant =
                    relevanceResult
                        .Trim()
                        .Equals(
                            "YES",
                            StringComparison.OrdinalIgnoreCase);

                Console.WriteLine(
                    "===== KNOWLEDGE RELEVANCE =====");

                Console.WriteLine(
                    $"Question: {question}");

                Console.WriteLine(
                    $"Gemini relevance result: {relevanceResult}");

                Console.WriteLine(
                    "================================");

                // =========================================
                // RELEVANT DEĞİLSE
                // =========================================

                if (!isRelevant)
                {
                    answer =
                        "Bu konuda henüz bilgim bulunmuyor.";

                    isAnswered = false;

                    await SaveUnknownQuestion(question);

                    // Bot mesajını kaydet
                    await _messageRepository.AddAsync(
                        new Message
                        {
                            ConversationId = conversation.Id,
                            Role = "Assistant",
                            Content = answer
                        });

                    return new ChatResultDto
                    {
                        ConversationId = conversation.Id,
                        Answer = answer,
                        IsAnswered = false
                    };
                }
            }

            // =========================================
            // CEVAP ÜRET
            // =========================================

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
                - Kendi genel bilgini kullanarak Elif hakkında
                  bilgi üretme.
                - Doğal ve profesyonel Türkçe kullan.
                - Gereksiz uzun cevap verme.
                - Sorunun cevabı birden fazla Knowledge kaydında
                  bulunuyorsa bu bilgileri birleştirerek cevap ver.
                - Kullanıcı açıkça Elif hakkında soruyorsa
                  üçüncü şahıs kullanabilirsin.
                """;

            answer =
                await _geminiService.GenerateAsync(prompt);

            isAnswered = true;
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
            IsAnswered = isAnswered
        };
    }

    // =========================================
    // UNKNOWN QUESTION KAYDET
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