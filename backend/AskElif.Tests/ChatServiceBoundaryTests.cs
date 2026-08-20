using Xunit;
using Moq;
using Microsoft.Extensions.Configuration;
using AskElif.API.Interfaces;
using AskElif.API.Models;
using AskElif.API.DTOs;
using AskElif.API.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AskElif.Tests
{
    public class ChatServiceBoundaryTests
    {
        private readonly Mock<IKnowledgeSearchService> _searchServiceMock;
        private readonly Mock<IUnknownQuestionRepository> _unknownRepoMock;
        private readonly Mock<IConversationRepository> _conversationRepoMock;
        private readonly Mock<IMessageRepository> _messageRepoMock;
        private readonly Mock<GeminiService> _geminiServiceMock;
        private readonly ChatService _chatService;

        public ChatServiceBoundaryTests()
        {
            _searchServiceMock = new Mock<IKnowledgeSearchService>();
            _unknownRepoMock = new Mock<IUnknownQuestionRepository>();
            _conversationRepoMock = new Mock<IConversationRepository>();
            _messageRepoMock = new Mock<IMessageRepository>();

            var mockConfig = new Mock<IConfiguration>();
            mockConfig.Setup(x => x["Gemini:ApiKey"]).Returns("fake-api-key");
            _geminiServiceMock = new Mock<GeminiService>(mockConfig.Object);

            _chatService = new ChatService(
                _searchServiceMock.Object,
                _unknownRepoMock.Object,
                _conversationRepoMock.Object,
                _messageRepoMock.Object,
                _geminiServiceMock.Object);
        }

        [Fact]
        public async Task AskAsync_WithSimilarityExactlyMinimum_CallsRelevanceCheck_Yes()
        {
            int conversationId = 1;
            string question = "What is the boundary test?";

            _conversationRepoMock.Setup(x => x.CreateIfNotExistsAsync(conversationId))
                .ReturnsAsync(new Conversation { Id = conversationId });

            var item = new KnowledgeItem { Title = "Boundary", Content = "Test content", Category = "Test" };
            var searchResult = new KnowledgeSearchResultDto { Item = item, SimilarityScore = 0.45 };
            _searchServiceMock.Setup(x => x.SearchAsync(question, 3))
                .ReturnsAsync(new List<KnowledgeSearchResultDto> { searchResult });

            // Relevance check YES
            _geminiServiceMock.Setup(x => x.GenerateAsync(It.Is<string>(p => p.Contains("yeterli ve ilgili midir"))))
                .ReturnsAsync("YES");
            _geminiServiceMock.Setup(x => x.GenerateAsync(It.Is<string>(p => p.Contains("Sen AskElif isimli"))))
                .ReturnsAsync("Relevance YES answer");

            var result = await _chatService.AskAsync(conversationId, question);

            Assert.NotNull(result);
            Assert.True(result.IsAnswered);
            Assert.Equal("Relevance YES answer", result.Answer);
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("yeterli ve ilgili midir"))), Times.Once);
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("Sen AskElif isimli"))), Times.Once);
        }

        [Fact]
        public async Task AskAsync_WithSimilarityExactlyMinimum_CallsRelevanceCheck_No_CreatesUnknown()
        {
            int conversationId = 2;
            string question = "What is the boundary test?";

            _conversationRepoMock.Setup(x => x.CreateIfNotExistsAsync(conversationId))
                .ReturnsAsync(new Conversation { Id = conversationId });

            var item = new KnowledgeItem { Title = "Boundary", Content = "Test content", Category = "Test" };
            var searchResult = new KnowledgeSearchResultDto { Item = item, SimilarityScore = 0.45 };
            _searchServiceMock.Setup(x => x.SearchAsync(question, 3))
                .ReturnsAsync(new List<KnowledgeSearchResultDto> { searchResult });

            // Relevance check NO
            _geminiServiceMock.Setup(x => x.GenerateAsync(It.Is<string>(p => p.Contains("yeterli ve ilgili midir"))))
                .ReturnsAsync("NO");

            var result = await _chatService.AskAsync(conversationId, question);

            Assert.NotNull(result);
            Assert.False(result.IsAnswered);
            Assert.Equal("Bu konuda henüz bilgim bulunmuyor.", result.Answer);
            _unknownRepoMock.Verify(x => x.AddAsync(It.Is<UnknownQuestion>(q => q.Question == question && !q.IsResolved)), Times.Once);
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("yeterli ve ilgili midir"))), Times.Once);
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("Sen AskElif isimli"))), Times.Never);
        }

        [Fact]
        public async Task AskAsync_WithSimilarityExactlyStrong_BypassesRelevanceCheck()
        {
            int conversationId = 3;
            string question = "Strong similarity test";

            _conversationRepoMock.Setup(x => x.CreateIfNotExistsAsync(conversationId))
                .ReturnsAsync(new Conversation { Id = conversationId });

            var item = new KnowledgeItem { Title = "Strong", Content = "Strong content", Category = "Test" };
            var searchResult = new KnowledgeSearchResultDto { Item = item, SimilarityScore = 0.70 };
            _searchServiceMock.Setup(x => x.SearchAsync(question, 3))
                .ReturnsAsync(new List<KnowledgeSearchResultDto> { searchResult });

            _geminiServiceMock.Setup(x => x.GenerateAsync(It.Is<string>(p => p.Contains("Sen AskElif isimli"))))
                .ReturnsAsync("Strong similarity answer");

            var result = await _chatService.AskAsync(conversationId, question);

            Assert.NotNull(result);
            Assert.True(result.IsAnswered);
            Assert.Equal("Strong similarity answer", result.Answer);
            // Relevance check should not be called
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("yeterli ve ilgili midir"))), Times.Never);
        }
    }
}
