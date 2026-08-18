using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AskElif.API.Data;
using AskElif.API.Models;
using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using Moq;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Collections.Generic;

namespace AskElif.Tests
{
    public class IntegrationTests : IClassFixture<TestWebApplicationFactory>
    {
        private readonly TestWebApplicationFactory _factory;
        private readonly HttpClient _client;

        public IntegrationTests(TestWebApplicationFactory factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        private Task SeedAdminUserAsync()
        {
            return Task.CompletedTask;
        }

        private async Task<string> GetTokenAsync()
        {
            await SeedAdminUserAsync();
            
            var loginRequest = new LoginRequestDto
            {
                Email = "admin@askelif.com",
                Password = "admin123"
            };
            
            var response = await _client.PostAsJsonAsync("/api/Auth/login", loginRequest);
            response.EnsureSuccessStatusCode();
            
            var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
            return loginResponse!.Token;
        }

        // ==========================================
        // FLOW 1: LOGIN -> TOKEN -> PROTECTED API
        // ==========================================
        [Fact]
        public async Task Flow_Login_ExtractToken_CallDashboard_Succeeds()
        {
            // 1. Get token
            var token = await GetTokenAsync();
            Assert.NotEmpty(token);

            // 2. Attach token to request headers
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // 3. Request Dashboard
            var response = await _client.GetAsync("/api/Dashboard");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var dashboard = await response.Content.ReadFromJsonAsync<DashboardDto>();
            Assert.NotNull(dashboard);
        }

        // ==========================================
        // FLOW 2: KNOWLEDGE CRUD FLOW
        // ==========================================
        [Fact]
        public async Task Flow_Knowledge_Create_Read_Update_Delete_Lifecycle()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Mock embedding generator response
            _factory.EmbeddingServiceMock.Setup(x => x.GenerateEmbeddingAsync(It.IsAny<string>()))
                .ReturnsAsync(new float[] { 0.1f, 0.2f, 0.3f });

            // 1. Create Knowledge
            var createDto = new CreateKnowledgeDto
            {
                Title = "Test Knowledge Title",
                Category = "Integration Test",
                Content = "This is a detailed integration test knowledge content.",
                Source = "System Test",
                Tags = "integration,test",
                Priority = 2,
                IsPublished = true
            };

            var postResponse = await _client.PostAsJsonAsync("/api/Knowledge", createDto);
            Assert.Equal(HttpStatusCode.Created, postResponse.StatusCode);

            var createdItem = await postResponse.Content.ReadFromJsonAsync<KnowledgeDto>();
            Assert.NotNull(createdItem);
            Assert.True(createdItem.Id > 0);
            Assert.Equal("Test Knowledge Title", createdItem.Title);

            // 2. GET by Id
            var getResponse = await _client.GetAsync($"/api/Knowledge/{createdItem.Id}");
            Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
            var fetchedItem = await getResponse.Content.ReadFromJsonAsync<KnowledgeDto>();
            Assert.NotNull(fetchedItem);
            Assert.Equal(createdItem.Content, fetchedItem.Content);

            // 3. Update Knowledge
            var updateDto = new UpdateKnowledgeDto
            {
                Title = "Updated Test Title",
                Category = "Integration Test Updated",
                Content = "Updated content value.",
                Source = "System Test Updated",
                Tags = "updated,test",
                Priority = 3,
                IsPublished = true
            };

            var putResponse = await _client.PutAsJsonAsync($"/api/Knowledge/{createdItem.Id}", updateDto);
            Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);

            // 4. Verify Update via GET
            var getUpdatedResponse = await _client.GetAsync($"/api/Knowledge/{createdItem.Id}");
            var fetchedUpdated = await getUpdatedResponse.Content.ReadFromJsonAsync<KnowledgeDto>();
            Assert.NotNull(fetchedUpdated);
            Assert.Equal("Updated Test Title", fetchedUpdated.Title);
            Assert.Equal("Updated content value.", fetchedUpdated.Content);

            // 5. Delete Knowledge
            var deleteResponse = await _client.DeleteAsync($"/api/Knowledge/{createdItem.Id}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            // 6. Verify Deleted (Get returns 404)
            var getDeletedResponse = await _client.GetAsync($"/api/Knowledge/{createdItem.Id}");
            Assert.Equal(HttpStatusCode.NotFound, getDeletedResponse.StatusCode);
        }

        // ==========================================
        // FLOW 3: UNKNOWN QUESTION FLOW
        // ==========================================
        [Fact]
        public async Task Flow_Chat_CreatesUnknownQuestion_Convert_Resolves()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Clear database tables for unknown questions & knowledge items
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                db.UnknownQuestions.RemoveRange(db.UnknownQuestions);
                db.KnowledgeItems.RemoveRange(db.KnowledgeItems);
                await db.SaveChangesAsync();
            }

            // 1. Send question that has no similarity (No Knowledge)
            _factory.EmbeddingServiceMock.Setup(x => x.GenerateEmbeddingAsync("Unanswered question"))
                .ReturnsAsync(new float[] { 0f, 1f, 0f }); // Far from any seeded embedding

            var chatRequest = new ChatRequestDto
            {
                ConversationId = null,
                Message = "Unanswered question"
            };

            _client.DefaultRequestHeaders.Authorization = null; // chat is public
            var chatResponse = await _client.PostAsJsonAsync("/api/Chat", chatRequest);
            Assert.Equal(HttpStatusCode.OK, chatResponse.StatusCode);

            var chatResult = await chatResponse.Content.ReadFromJsonAsync<ChatResponseDto>();
            Assert.NotNull(chatResult);
            Assert.False(chatResult.IsAnswered);
            Assert.Equal("Bu konuda henüz bilgim bulunmuyor.", chatResult.Answer);

            // 2. Login again and fetch Unknown Questions list to find the generated item
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var unknownListResponse = await _client.GetAsync("/api/UnknownQuestions");
            Assert.Equal(HttpStatusCode.OK, unknownListResponse.StatusCode);

            var unknownQuestions = await unknownListResponse.Content.ReadFromJsonAsync<List<UnknownQuestion>>();
            Assert.NotNull(unknownQuestions);
            Assert.NotEmpty(unknownQuestions);

            var unresolvedQuestion = unknownQuestions.FirstOrDefault(q => q.Question == "Unanswered question");
            Assert.NotNull(unresolvedQuestion);
            Assert.False(unresolvedQuestion.IsResolved);

            // 3. Convert Unknown Question to Knowledge
            var convertDto = new ConvertUnknownQuestionDto
            {
                Category = "New Category",
                Answer = "Seeded answer from conversion"
            };

            // Mock embedding for the newly created Knowledge item
            _factory.EmbeddingServiceMock.Setup(x => x.GenerateEmbeddingAsync(It.Is<string>(s => s.Contains("Unanswered question"))))
                .ReturnsAsync(new float[] { 1f, 0f, 0f }); // [1,0,0] vector for Knowledge

            var convertResponse = await _client.PostAsJsonAsync($"/api/UnknownQuestions/{unresolvedQuestion.Id}/convert-to-knowledge", convertDto);
            Assert.Equal(HttpStatusCode.OK, convertResponse.StatusCode);

            // 4. Verify it is marked Resolved in DB
            var getResolvedResponse = await _client.GetAsync($"/api/UnknownQuestions/{unresolvedQuestion.Id}");
            var resolvedQuestion = await getResolvedResponse.Content.ReadFromJsonAsync<UnknownQuestion>();
            Assert.NotNull(resolvedQuestion);
            Assert.True(resolvedQuestion.IsResolved);

            // 5. Ask the same question again to chatbot (Should match strong similarity now)
            // Mock embedding search query to match the Knowledge item: [1,0,0]
            _factory.EmbeddingServiceMock.Setup(x => x.GenerateEmbeddingAsync("Unanswered question"))
                .ReturnsAsync(new float[] { 1f, 0f, 0f }); // Matches exactly! [1,0,0] vs [1,0,0] = 1.0

            _factory.GeminiServiceMock.Setup(x => x.GenerateAsync(It.Is<string>(p => p.Contains("Sen AskElif isimli"))))
                .ReturnsAsync("Here is the newly generated answer using knowledge.");

            _client.DefaultRequestHeaders.Authorization = null; // Public chat
            var chatResponse2 = await _client.PostAsJsonAsync("/api/Chat", chatRequest);
            Assert.Equal(HttpStatusCode.OK, chatResponse2.StatusCode);

            var chatResult2 = await chatResponse2.Content.ReadFromJsonAsync<ChatResponseDto>();
            Assert.NotNull(chatResult2);
            Assert.True(chatResult2.IsAnswered);
            Assert.Equal("Here is the newly generated answer using knowledge.", chatResult2.Answer);
        }

        // ==========================================
        // FLOW 4: CONVERSATION FLOW
        // ==========================================
        [Fact]
        public async Task Flow_Conversation_CreatesSession_KeepsId_RetrievesOrderedHistory()
        {
            // Clear conversations and messages
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                db.Conversations.RemoveRange(db.Conversations);
                db.Messages.RemoveRange(db.Messages);
                await db.SaveChangesAsync();
            }

            // Set search to not find anything to make it simple
            _factory.EmbeddingServiceMock.Setup(x => x.GenerateEmbeddingAsync(It.IsAny<string>()))
                .ReturnsAsync(new float[] { 0f, 0f, 1f });

            // 1. Send first message
            var request1 = new ChatRequestDto
            {
                ConversationId = null,
                Message = "First Question"
            };

            var chatResponse1 = await _client.PostAsJsonAsync("/api/Chat", request1);
            var result1 = await chatResponse1.Content.ReadFromJsonAsync<ChatResponseDto>();
            Assert.NotNull(result1);
            Assert.True(result1.ConversationId > 0);

            int conversationId = result1.ConversationId;

            // 2. Send second message with the returned ConversationId
            var request2 = new ChatRequestDto
            {
                ConversationId = conversationId,
                Message = "Second Question"
            };

            var chatResponse2 = await _client.PostAsJsonAsync("/api/Chat", request2);
            var result2 = await chatResponse2.Content.ReadFromJsonAsync<ChatResponseDto>();
            Assert.NotNull(result2);
            Assert.Equal(conversationId, result2.ConversationId);

            // 3. Login and retrieve Conversation detail to check order of messages
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var convResponse = await _client.GetAsync($"/api/Conversation/{conversationId}");
            Assert.Equal(HttpStatusCode.OK, convResponse.StatusCode);

            var conversationDetails = await convResponse.Content.ReadFromJsonAsync<ConversationDto>();
            Assert.NotNull(conversationDetails);
            Assert.Equal(conversationId, conversationDetails.Id);
            
            // Should contain 4 messages: User, Assistant, User, Assistant
            Assert.Equal(4, conversationDetails.Messages.Count);

            // Check roles and chronological order
            Assert.Equal("User", conversationDetails.Messages[0].Role);
            Assert.Equal("First Question", conversationDetails.Messages[0].Content);

            Assert.Equal("Assistant", conversationDetails.Messages[1].Role);
            Assert.Equal("Bu konuda henüz bilgim bulunmuyor.", conversationDetails.Messages[1].Content);

            Assert.Equal("User", conversationDetails.Messages[2].Role);
            Assert.Equal("Second Question", conversationDetails.Messages[2].Content);

            Assert.Equal("Assistant", conversationDetails.Messages[3].Role);
            Assert.Equal("Bu konuda henüz bilgim bulunmuyor.", conversationDetails.Messages[3].Content);
        }
    }
}
