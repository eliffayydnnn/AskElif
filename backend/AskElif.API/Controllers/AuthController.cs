using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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
}