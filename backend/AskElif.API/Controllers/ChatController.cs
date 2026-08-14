using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost]
    public async Task<IActionResult> Ask(ChatRequestDto request)
    {
        try
        {
            Console.WriteLine("=================================");
            Console.WriteLine("CHAT REQUEST");
            Console.WriteLine($"ConversationId: {request.ConversationId}");
            Console.WriteLine($"Message: {request.Message}");
            Console.WriteLine("=================================");

            var result = await _chatService.AskAsync(
                request.ConversationId,
                request.Message);

            return Ok(new ChatResponseDto
            {
                ConversationId = result.ConversationId,
                Answer = result.Answer,
                IsAnswered = result.IsAnswered
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine("=================================");
            Console.WriteLine("CHAT ERROR");
            Console.WriteLine(ex.ToString());
            Console.WriteLine("=================================");

            return StatusCode(500, new
            {
                message = "Chat sırasında bir hata oluştu.",
                error = ex.Message,
                detail = ex.ToString()
            });
        }
    }
}