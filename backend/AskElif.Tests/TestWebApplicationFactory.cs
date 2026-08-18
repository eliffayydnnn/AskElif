using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using AskElif.API.Data;
using AskElif.API.Interfaces;
using AskElif.API.Services;
using Moq;
using System;
using System.Linq;

namespace AskElif.Tests
{
    public class TestWebApplicationFactory : WebApplicationFactory<Program>
    {
        private readonly string _dbName = "AskElifTestDb_" + Guid.NewGuid().ToString();

        public Mock<GeminiService> GeminiServiceMock { get; }
        public Mock<IEmbeddingService> EmbeddingServiceMock { get; }

        public TestWebApplicationFactory()
        {
            var mockConfig = new Mock<IConfiguration>();
            mockConfig.Setup(x => x["Gemini:ApiKey"]).Returns("fake-api-key");
            GeminiServiceMock = new Mock<GeminiService>(mockConfig.Object);
            EmbeddingServiceMock = new Mock<IEmbeddingService>();
            EmbeddingServiceMock.Setup(x => x.GenerateEmbeddingAsync(It.IsAny<string>()))
                .ReturnsAsync(new float[1536]); // fake embedding vector
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");

            builder.ConfigureServices(services =>
            {
                // Remove existing DbContextOptions
                var dbDescriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
                if (dbDescriptor != null)
                {
                    services.Remove(dbDescriptor);
                }

                // Add InMemory Database
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase(_dbName);
                });

                // Remove original GeminiService and IEmbeddingService
                var geminiDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(GeminiService));
                if (geminiDescriptor != null)
                {
                    services.Remove(geminiDescriptor);
                }

                var embeddingDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IEmbeddingService));
                if (embeddingDescriptor != null)
                {
                    services.Remove(embeddingDescriptor);
                }

                // Register mocks
                services.AddScoped(_ => GeminiServiceMock.Object);
                services.AddScoped(_ => EmbeddingServiceMock.Object);

                // Seed database
                var sp = services.BuildServiceProvider();
                using (var scope = sp.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    db.Database.EnsureCreated();

                    if (!db.AdminUsers.Any(x => x.Email == "admin@askelif.com"))
                    {
                        db.AdminUsers.Add(new AskElif.API.Models.AdminUser
                        {
                            Email = "admin@askelif.com",
                            FullName = "Elif Aydin",
                            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123")
                        });
                        db.SaveChanges();
                    }
                }
            });
        }
    }
}
