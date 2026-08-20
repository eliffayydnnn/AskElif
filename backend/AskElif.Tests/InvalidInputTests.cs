using Xunit;
using Moq;
using AskElif.API.DTOs;
using AskElif.API.Models;
using AskElif.API.Data;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace AskElif.Tests
{
    public class InvalidInputTests : IClassFixture<TestWebApplicationFactory>
    {
        private readonly TestWebApplicationFactory _factory;
        private readonly HttpClient _client;

        public InvalidInputTests(TestWebApplicationFactory factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        private async Task<string> GetTokenAsync()
        {
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

        [Fact]
        public async Task Login_WithEmptyEmail_ReturnsUnauthorized()
        {
            var loginRequest = new LoginRequestDto
            {
                Email = "",
                Password = "admin123"
            };

            var response = await _client.PostAsJsonAsync("/api/Auth/login", loginRequest);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Login_WithEmptyPassword_ReturnsUnauthorized()
        {
            var loginRequest = new LoginRequestDto
            {
                Email = "admin@askelif.com",
                Password = ""
            };

            var response = await _client.PostAsJsonAsync("/api/Auth/login", loginRequest);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Login_WithWrongEmail_ReturnsUnauthorized()
        {
            var loginRequest = new LoginRequestDto
            {
                Email = "wrong@example.com",
                Password = "admin123"
            };

            var response = await _client.PostAsJsonAsync("/api/Auth/login", loginRequest);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task ConvertToKnowledge_WithEmptyAnswer_Returns400()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            int questionId;
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var question = new UnknownQuestion
                {
                    Question = "Test empty answer",
                    IsResolved = false
                };
                db.UnknownQuestions.Add(question);
                await db.SaveChangesAsync();
                questionId = question.Id;
            }

            var dto = new ConvertUnknownQuestionDto
            {
                Category = "Test",
                Answer = ""
            };

            var response = await _client.PostAsJsonAsync(
                $"/api/UnknownQuestions/{questionId}/convert-to-knowledge",
                dto);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task ConvertToKnowledge_WithEmptyCategory_Returns400()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            int questionId;
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var question = new UnknownQuestion
                {
                    Question = "Test empty category",
                    IsResolved = false
                };
                db.UnknownQuestions.Add(question);
                await db.SaveChangesAsync();
                questionId = question.Id;
            }

            var dto = new ConvertUnknownQuestionDto
            {
                Category = "",
                Answer = "Some answer"
            };

            var response = await _client.PostAsJsonAsync(
                $"/api/UnknownQuestions/{questionId}/convert-to-knowledge",
                dto);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task ConvertToKnowledge_AlreadyResolved_Returns400()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            int questionId;
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var question = new UnknownQuestion
                {
                    Question = "Already resolved question",
                    IsResolved = true
                };
                db.UnknownQuestions.Add(question);
                await db.SaveChangesAsync();
                questionId = question.Id;
            }

            var dto = new ConvertUnknownQuestionDto
            {
                Category = "Test",
                Answer = "Answer"
            };

            var response = await _client.PostAsJsonAsync(
                $"/api/UnknownQuestions/{questionId}/convert-to-knowledge",
                dto);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

            var body = await response.Content.ReadAsStringAsync();
            Assert.Contains("zaten çözüldü", body);
        }

        [Fact]
        public async Task Chat_WithEmptyMessage_StillProcessesRequest()
        {
            _client.DefaultRequestHeaders.Authorization = null;

            _factory.EmbeddingServiceMock
                .Setup(x => x.GenerateEmbeddingAsync(It.IsAny<string>()))
                .ReturnsAsync(new float[] { 0f, 0f, 1f });

            var request = new ChatRequestDto
            {
                ConversationId = null,
                Message = ""
            };

            var response = await _client.PostAsJsonAsync("/api/Chat", request);

            // Not: Controller'da boş mesaj validasyonu yok; mevcut davranış 200 OK.
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task Knowledge_CreateWithEmptyTitle_StillCreatesItem()
        {
            var token = await GetTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            _factory.EmbeddingServiceMock
                .Setup(x => x.GenerateEmbeddingAsync(It.IsAny<string>()))
                .ReturnsAsync(new float[] { 0.1f, 0.2f, 0.3f });

            var createDto = new CreateKnowledgeDto
            {
                Title = "",
                Category = "",
                Content = "",
                Source = "",
                Tags = "",
                Priority = 1,
                IsPublished = true
            };

            var response = await _client.PostAsJsonAsync("/api/Knowledge", createDto);

            // Not: KnowledgeController'da boş alan validasyonu yok; mevcut davranış 201 Created.
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }
    }
}
