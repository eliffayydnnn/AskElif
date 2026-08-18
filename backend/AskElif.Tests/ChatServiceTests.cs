using Xunit;
using Moq;
using Microsoft.Extensions.Configuration;
using AskElif.API.Interfaces;
using AskElif.API.Models;
using AskElif.API.DTOs;
using AskElif.API.Services;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace AskElif.Tests
{
    public class ChatServiceTests
    {
        private readonly Mock<IKnowledgeSearchService> _searchServiceMock;
        private readonly Mock<IUnknownQuestionRepository> _unknownRepoMock;
        private readonly Mock<IConversationRepository> _conversationRepoMock;
        private readonly Mock<IMessageRepository> _messageRepoMock;
        private readonly Mock<GeminiService> _geminiServiceMock;
        private readonly ChatService _chatService;

        public ChatServiceTests()
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
                _geminiServiceMock.Object
            );
        }

        [Fact]
        public async Task AskAsync_WithNoKnowledgeFound_SavesUnknownQuestionAndReturnsFalse()
        {
            // Arrange
            int conversationId = 10;
            string question = "What is Elif's favorite color?";
            
            _conversationRepoMock.Setup(x => x.CreateIfNotExistsAsync(conversationId))
                .ReturnsAsync(new Conversation { Id = conversationId });

            _searchServiceMock.Setup(x => x.SearchAsync(question, 3))
                .ReturnsAsync(new List<KnowledgeSearchResultDto>()); // empty

            // Act
            var result = await _chatService.AskAsync(conversationId, question);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(conversationId, result.ConversationId);
            Assert.False(result.IsAnswered);
            Assert.Equal("Bu konuda henüz bilgim bulunmuyor.", result.Answer);

            // Verify message saves
            _messageRepoMock.Verify(x => x.AddAsync(It.Is<Message>(m => m.Role == "User" && m.Content == question)), Times.Once);
            _messageRepoMock.Verify(x => x.AddAsync(It.Is<Message>(m => m.Role == "Assistant" && m.Content == "Bu konuda henüz bilgim bulunmuyor.")), Times.Once);
            
            // Verify unknown question recorded
            _unknownRepoMock.Verify(x => x.AddAsync(It.Is<UnknownQuestion>(q => q.Question == question && !q.IsResolved)), Times.Once);
            
            // Gemini should not be called
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task AskAsync_WithStrongSimilarity_BypassesRelevanceCheckAndReturnsAnswer()
        {
            // Arrange
            int conversationId = 10;
            string question = "Where did Elif study?";
            
            _conversationRepoMock.Setup(x => x.CreateIfNotExistsAsync(conversationId))
                .ReturnsAsync(new Conversation { Id = conversationId });

            var item = new KnowledgeItem
            {
                Title = "Education",
                Content = "Elif studied computer engineering.",
                Category = "Education"
            };

            var searchResult = new KnowledgeSearchResultDto
            {
                Item = item,
                SimilarityScore = 0.85 // Strong similarity (> 0.70)
            };

            _searchServiceMock.Setup(x => x.SearchAsync(question, 3))
                .ReturnsAsync(new List<KnowledgeSearchResultDto> { searchResult });

            _geminiServiceMock.Setup(x => x.GenerateAsync(It.IsAny<string>()))
                .ReturnsAsync("Elif studied computer engineering at university.");

            // Act
            var result = await _chatService.AskAsync(conversationId, question);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsAnswered);
            Assert.Equal("Elif studied computer engineering at university.", result.Answer);

            // Verify Gemini called exactly once (bypass relevance check, directly call generate answer)
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("Sen AskElif isimli"))), Times.Once);
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("yeterli ve ilgili midir"))), Times.Never);

            _messageRepoMock.Verify(x => x.AddAsync(It.Is<Message>(m => m.Role == "Assistant" && m.Content == "Elif studied computer engineering at university.")), Times.Once);
            _unknownRepoMock.Verify(x => x.AddAsync(It.IsAny<UnknownQuestion>()), Times.Never);
        }

        [Fact]
        public async Task AskAsync_WithMediumSimilarityRelevanceYes_PerformsCheckAndGeneratesAnswer()
        {
            // Arrange
            int conversationId = 10;
            string question = "Does Elif know C#?";
            
            _conversationRepoMock.Setup(x => x.CreateIfNotExistsAsync(conversationId))
                .ReturnsAsync(new Conversation { Id = conversationId });

            var item = new KnowledgeItem
            {
                Title = "Skills",
                Content = "Elif is fluent in C#.",
                Category = "Skills"
            };

            var searchResult = new KnowledgeSearchResultDto
            {
                Item = item,
                SimilarityScore = 0.55 // Medium similarity (0.45 <= score < 0.70)
            };

            _searchServiceMock.Setup(x => x.SearchAsync(question, 3))
                .ReturnsAsync(new List<KnowledgeSearchResultDto> { searchResult });

            // Setup first call for relevance check to return YES, second call for answering to return the actual answer
            _geminiServiceMock.Setup(x => x.GenerateAsync(It.Is<string>(p => p.Contains("yeterli ve ilgili midir"))))
                .ReturnsAsync("YES");

            _geminiServiceMock.Setup(x => x.GenerateAsync(It.Is<string>(p => p.Contains("Sen AskElif isimli"))))
                .ReturnsAsync("Yes, Elif is highly skilled in C#.");

            // Act
            var result = await _chatService.AskAsync(conversationId, question);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsAnswered);
            Assert.Equal("Yes, Elif is highly skilled in C#.", result.Answer);

            // Verify both relevance check and generation are called
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("yeterli ve ilgili midir"))), Times.Once);
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("Sen AskElif isimli"))), Times.Once);

            _unknownRepoMock.Verify(x => x.AddAsync(It.IsAny<UnknownQuestion>()), Times.Never);
        }

        [Fact]
        public async Task AskAsync_WithMediumSimilarityRelevanceNo_SavesUnknownAndReturnsFalse()
        {
            // Arrange
            int conversationId = 10;
            string question = "Does Elif play football?";
            
            _conversationRepoMock.Setup(x => x.CreateIfNotExistsAsync(conversationId))
                .ReturnsAsync(new Conversation { Id = conversationId });

            var item = new KnowledgeItem
            {
                Title = "Hobbies",
                Content = "Elif likes playing chess.",
                Category = "Hobbies"
            };

            var searchResult = new KnowledgeSearchResultDto
            {
                Item = item,
                SimilarityScore = 0.50 // Medium similarity
            };

            _searchServiceMock.Setup(x => x.SearchAsync(question, 3))
                .ReturnsAsync(new List<KnowledgeSearchResultDto> { searchResult });

            // Relevance check returns NO
            _geminiServiceMock.Setup(x => x.GenerateAsync(It.Is<string>(p => p.Contains("yeterli ve ilgili midir"))))
                .ReturnsAsync("NO");

            // Act
            var result = await _chatService.AskAsync(conversationId, question);

            // Assert
            Assert.NotNull(result);
            Assert.False(result.IsAnswered);
            Assert.Equal("Bu konuda henüz bilgim bulunmuyor.", result.Answer);

            // Verify only relevance check was run, and answer generation prompt was bypassed
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("yeterli ve ilgili midir"))), Times.Once);
            _geminiServiceMock.Verify(x => x.GenerateAsync(It.Is<string>(p => p.Contains("Sen AskElif isimli"))), Times.Never);

            // Check that it gets treated as UnknownQuestion
            _unknownRepoMock.Verify(x => x.AddAsync(It.Is<UnknownQuestion>(q => q.Question == question)), Times.Once);
            _messageRepoMock.Verify(x => x.AddAsync(It.Is<Message>(m => m.Role == "Assistant" && m.Content == "Bu konuda henüz bilgim bulunmuyor.")), Times.Once);
        }

        [Fact]
        public async Task AskAsync_WithNullConversationId_CreatesNewConversation()
        {
            // Arrange
            _conversationRepoMock.Setup(x => x.CreateIfNotExistsAsync(null))
                .ReturnsAsync(new Conversation { Id = 99 });

            _searchServiceMock.Setup(x => x.SearchAsync(It.IsAny<string>(), 3))
                .ReturnsAsync(new List<KnowledgeSearchResultDto>());

            // Act
            var result = await _chatService.AskAsync(null, "Hello");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(99, result.ConversationId);
            _conversationRepoMock.Verify(x => x.CreateIfNotExistsAsync(null), Times.Once);
        }

        [Fact]
        public async Task AskAsync_WithExistingConversationId_UsesExisting()
        {
            // Arrange
            int existingId = 55;
            _conversationRepoMock.Setup(x => x.CreateIfNotExistsAsync(existingId))
                .ReturnsAsync(new Conversation { Id = existingId });

            _searchServiceMock.Setup(x => x.SearchAsync(It.IsAny<string>(), 3))
                .ReturnsAsync(new List<KnowledgeSearchResultDto>());

            // Act
            var result = await _chatService.AskAsync(existingId, "Hello");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(existingId, result.ConversationId);
            _conversationRepoMock.Verify(x => x.CreateIfNotExistsAsync(existingId), Times.Once);
        }
    }
}
