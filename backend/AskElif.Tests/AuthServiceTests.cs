using Xunit;
using Moq;
using Microsoft.Extensions.Configuration;
using AskElif.API.Interfaces;
using AskElif.API.Models;
using AskElif.API.DTOs;
using AskElif.API.Services;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace AskElif.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<IAdminRepository> _adminRepoMock;
        private readonly Mock<IConfiguration> _configMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _adminRepoMock = new Mock<IAdminRepository>();
            _configMock = new Mock<IConfiguration>();

            // Setup configuration values
            _configMock.Setup(x => x["Jwt:Key"]).Returns("AskElifSuperSecretKey2026!123456789");
            _configMock.Setup(x => x["Jwt:Issuer"]).Returns("AskElifAPI");
            _configMock.Setup(x => x["Jwt:Audience"]).Returns("AskElifAdmin");
            _configMock.Setup(x => x["Jwt:ExpireMinutes"]).Returns("120");

            _authService = new AuthService(_adminRepoMock.Object, _configMock.Object);
        }

        [Fact]
        public async Task LoginAsync_WithCorrectCredentials_ReturnsLoginResponseWithValidToken()
        {
            // Arrange
            var email = "admin@askelif.com";
            var password = "CorrectPassword123";
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            
            var adminUser = new AdminUser
            {
                Id = 1,
                Email = email,
                FullName = "Elif Aydin",
                PasswordHash = hashedPassword
            };

            _adminRepoMock.Setup(x => x.GetByEmailAsync(email)).ReturnsAsync(adminUser);

            var request = new LoginRequestDto { Email = email, Password = password };

            // Act
            var result = await _authService.LoginAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Elif Aydin", result.FullName);
            Assert.NotNull(result.Token);

            // Decode Token to verify claims
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(result.Token);

            Assert.Equal("AskElifAPI", jwtToken.Issuer);
            Assert.Equal("AskElifAdmin", jwtToken.Audiences.First());
            
            // Check claims
            var nameIdClaim = jwtToken.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var nameClaim = jwtToken.Claims.First(c => c.Type == ClaimTypes.Name).Value;
            var emailClaim = jwtToken.Claims.First(c => c.Type == ClaimTypes.Email).Value;

            Assert.Equal("1", nameIdClaim);
            Assert.Equal("Elif Aydin", nameClaim);
            Assert.Equal(email, emailClaim);

            // Check Expiration
            var expectedExpire = DateTime.UtcNow.AddMinutes(120);
            var actualExpire = jwtToken.ValidTo;
            Assert.True((actualExpire - expectedExpire).Duration().TotalMinutes < 2);
        }

        [Fact]
        public async Task LoginAsync_WithWrongEmail_ReturnsNull()
        {
            // Arrange
            var email = "admin@askelif.com";
            _adminRepoMock.Setup(x => x.GetByEmailAsync(email)).ReturnsAsync((AdminUser?)null);

            var request = new LoginRequestDto { Email = email, Password = "AnyPassword" };

            // Act
            var result = await _authService.LoginAsync(request);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task LoginAsync_WithWrongPassword_ReturnsNull()
        {
            // Arrange
            var email = "admin@askelif.com";
            var correctPassword = "CorrectPassword123";
            var wrongPassword = "WrongPassword123";
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(correctPassword);

            var adminUser = new AdminUser
            {
                Id = 1,
                Email = email,
                FullName = "Elif Aydin",
                PasswordHash = hashedPassword
            };

            _adminRepoMock.Setup(x => x.GetByEmailAsync(email)).ReturnsAsync(adminUser);

            var request = new LoginRequestDto { Email = email, Password = wrongPassword };

            // Act
            var result = await _authService.LoginAsync(request);

            // Assert
            Assert.Null(result);
        }
    }
}
