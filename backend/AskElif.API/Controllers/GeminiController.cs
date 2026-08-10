using AskElif.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GeminiController : ControllerBase
{
    private readonly GeminiService _geminiService;

    public GeminiController(GeminiService geminiService)
    {
        _geminiService = geminiService;
    }

    [HttpPost("test")]
    public async Task<IActionResult> Test()
    {
        try
        {
            var response = await _geminiService.GenerateAsync(
                "Merhaba! Sen AskElif isimli bir CV chatbotusun. Kısaca kendini tanıt."
            );

            return Ok(new
            {
                success = true,
                response
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = ex.Message
            });
        }
    }
}