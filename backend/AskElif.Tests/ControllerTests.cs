using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AskElif.API.Data;
using AskElif.API.Models;
using AskElif.API.DTOs;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace AskElif.Tests
{
    public class ControllerTests : IClassFixture<TestWebApplicationFactory>
    {
        private readonly TestWebApplicationFactory _factory;
        private readonly HttpClient _client;

        public ControllerTests(TestWebApplicationFactory factory)
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

        private string GenerateExpiredToken()
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Name, "Elif Aydin"),
                new Claim(ClaimTypes.Email, "admin@askelif.com")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("AskElifSuperSecretKey2026!123456789"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "AskElifAPI",
                audience: "AskElifAdmin",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(-60), // Expired 1 hour ago
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ==========================================
        // 1. AUTHENTICATION & AUTHORIZATION TESTS
        // ==========================================

        [Fact]
        public async Task ProtectedEndpoints_WithoutToken_ReturnsUnauthorized()
        {
            // Reset authorization header
            _client.DefaultRequestHeaders.Authorization = null;

            var endpoints = new[]
            {
                "/api/Knowledge",
                "/api/Dashboard",
                "/api/Conversation",
                "/api/UnknownQuestions"
            };

            foreach (var endpoint in endpoints)
            {
                var response = await _client.GetAsync(endpoint);
                Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            }
        }

        [Fact]
        public async Task ProtectedEndpoints_WithInvalidToken_ReturnsUnauthorized()
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "invalid-fake-token-xyz");

            var response = await _client.GetAsync("/api/Knowledge");
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task ProtectedEndpoints_WithExpiredToken_ReturnsUnauthorized()
        {
            var expiredToken = GenerateExpiredToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", expiredToken);

            var response = await _client.GetAsync("/api/Knowledge");
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Login_WithCorrectCredentials_ReturnsTokenAnd200()
        {
            await SeedAdminUserAsync();
            var loginRequest = new LoginRequestDto
            {
                Email = "admin@askelif.com",
                Password = "admin123"
            };

            var response = await _client.PostAsJsonAsync("/api/Auth/login", loginRequest);
            
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var result = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
            Assert.NotNull(result);
            Assert.NotEmpty(result.Token);
            Assert.Equal("Elif Aydin", result.FullName);
        }

        [Fact]
        public async Task Login_WithIncorrectCredentials_Returns401()
        {
            await SeedAdminUserAsync();
            var loginRequest = new LoginRequestDto
            {
                Email = "admin@askelif.com",
                Password = "wrongpassword"
            };

            var response = await _client.PostAsJsonAsync("/api/Auth/login", loginRequest);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        // ==========================================
        // 2. CONTROLLER ENDPOINT TESTS
        // ==========================================

        [Fact]
        public async Task Knowledge_GetNonExistentId_Returns404()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/Knowledge/9999");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task Knowledge_PutNonExistentId_Returns404()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var updateDto = new UpdateKnowledgeDto
            {
                Title = "NonExistent",
                Category = "Test",
                Content = "Content",
                Source = "Test",
                Tags = "test",
                Priority = 1,
                IsPublished = true
            };

            var response = await _client.PutAsJsonAsync("/api/Knowledge/9999", updateDto);
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task Knowledge_DeleteNonExistentId_Returns404()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.DeleteAsync("/api/Knowledge/9999");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task Conversation_GetNonExistentId_Returns404()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/Conversation/9999");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task Conversation_DeleteNonExistentId_Returns404()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.DeleteAsync("/api/Conversation/9999");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UnknownQuestions_GetNonExistentId_Returns404()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/UnknownQuestions/9999");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UnknownQuestions_ResolveNonExistentId_Returns404()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.PutAsync("/api/UnknownQuestions/9999/resolve", null);
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UnknownQuestions_ConvertToKnowledgeNonExistentId_Returns404()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new ConvertUnknownQuestionDto
            {
                Category = "Test",
                Answer = "Some Answer"
            };

            var response = await _client.PostAsJsonAsync("/api/UnknownQuestions/9999/convert-to-knowledge", dto);
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task Knowledge_GetAll_Returns200()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/Knowledge");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task Knowledge_Create_Returns201()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            _factory.EmbeddingServiceMock
                .Setup(x => x.GenerateEmbeddingAsync(It.IsAny<string>()))
                .ReturnsAsync(new float[] { 0.1f, 0.2f, 0.3f });

            var createDto = new CreateKnowledgeDto
            {
                Title = "Controller Test Knowledge",
                Category = "Test",
                Content = "Controller test content",
                Source = "Unit Test",
                Tags = "test",
                Priority = 1,
                IsPublished = true
            };

            var response = await _client.PostAsJsonAsync("/api/Knowledge", createDto);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            var created = await response.Content.ReadFromJsonAsync<KnowledgeDto>();
            Assert.NotNull(created);
            Assert.True(created.Id > 0);
        }

        [Fact]
        public async Task Dashboard_Get_Returns200()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/Dashboard");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var dashboard = await response.Content.ReadFromJsonAsync<DashboardDto>();
            Assert.NotNull(dashboard);
        }

        [Fact]
        public async Task Conversation_GetAll_Returns200()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/Conversation");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task UnknownQuestions_GetAll_Returns200()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/UnknownQuestions");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task UnknownQuestions_ResolveExisting_Returns200()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            int questionId;
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var question = new UnknownQuestion
                {
                    Question = "Resolve test question",
                    IsResolved = false
                };
                db.UnknownQuestions.Add(question);
                await db.SaveChangesAsync();
                questionId = question.Id;
            }

            var response = await _client.PutAsync($"/api/UnknownQuestions/{questionId}/resolve", null);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var resolved = await response.Content.ReadFromJsonAsync<UnknownQuestion>();
            Assert.NotNull(resolved);
            Assert.True(resolved.IsResolved);
        }

        [Fact]
        public async Task UnknownQuestions_DeleteExisting_Returns204()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            int questionId;
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var question = new UnknownQuestion
                {
                    Question = "Delete test question",
                    IsResolved = false
                };
                db.UnknownQuestions.Add(question);
                await db.SaveChangesAsync();
                questionId = question.Id;
            }

            var response = await _client.DeleteAsync($"/api/UnknownQuestions/{questionId}");
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            var getResponse = await _client.GetAsync($"/api/UnknownQuestions/{questionId}");
            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }

        [Fact]
        public async Task Chat_PostToPublicEndpoint_Returns200()
        {
            // Public endpoint, no token required
            _client.DefaultRequestHeaders.Authorization = null;

            // Setup ChatMock results
            _factory.GeminiServiceMock.Setup(x => x.GenerateAsync(It.IsAny<string>()))
                .ReturnsAsync("Hello from Mock Gemini!");

            var request = new ChatRequestDto
            {
                ConversationId = null,
                Message = "Hello chatbot"
            };

            var response = await _client.PostAsJsonAsync("/api/Chat", request);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<ChatResponseDto>();
            Assert.NotNull(result);
            Assert.NotNull(result.Answer);
        }
    }
}
