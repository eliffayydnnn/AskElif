using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using AskElif.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IAdminRepository _adminRepository;

    public AuthController(
        IAuthService authService,
        IAdminRepository adminRepository)
    {
        _authService = authService;
        _adminRepository = adminRepository;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        var result = await _authService.LoginAsync(request);

        if (result == null)
        {
            return Unauthorized(new
            {
                message = "Email veya şifre hatalı."
            });
        }

        return Ok(result);
    }

    [HttpPost("seed-admin")]
    public async Task<IActionResult> SeedAdmin()
    {
        var existingAdmin = await _adminRepository.GetByEmailAsync("admin@askelif.com");

        if (existingAdmin != null)
        {
            return Ok(new
            {
                message = "Admin zaten mevcut."
            });
        }

        await _adminRepository.AddAsync(new AdminUser
        {
            FullName = "Elif Aydın",
            Email = "admin@askelif.com",

            // Şimdilik düz metin.
            // Daha sonra BCrypt ile hash'leyeceğiz.
            PasswordHash = "123456"
        });

        return Ok(new
        {
            message = "Admin oluşturuldu."
        });
    }
}