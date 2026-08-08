using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AskElif.API.Services;

public class AuthService : IAuthService
{
    private readonly IAdminRepository _adminRepository;
    private readonly IConfiguration _configuration;

    public AuthService(
        IAdminRepository adminRepository,
        IConfiguration configuration)
    {
        _adminRepository = adminRepository;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var admin = await _adminRepository.GetByEmailAsync(request.Email);

        if (admin == null)
            return null;

        // BCrypt ile şifre doğrulama
        bool passwordValid = BCrypt.Net.BCrypt.Verify(
            request.Password,
            admin.PasswordHash
        );

        if (!passwordValid)
            return null;

        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                admin.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Name,
                admin.FullName
            ),

            new Claim(
                ClaimTypes.Email,
                admin.Email
            )
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]!
            )
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(
                    _configuration["Jwt:ExpireMinutes"]
                )
            ),
            signingCredentials: credentials
        );

        return new LoginResponseDto
        {
            Token = new JwtSecurityTokenHandler()
                .WriteToken(token),

            FullName = admin.FullName
        };
    }
}