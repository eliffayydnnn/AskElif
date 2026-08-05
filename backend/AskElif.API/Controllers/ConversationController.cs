using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConversationController : ControllerBase
{
    private readonly IConversationRepository _conversationRepository;

    public ConversationController(IConversationRepository conversationRepository)
    {
        _conversationRepository = conversationRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var conversations = await _conversationRepository.GetAllAsync();

        var result = conversations.Select(c => new ConversationDto
        {
            Id = c.Id,
            SessionId = c.SessionId,
            StartedAt = c.StartedAt,
            Messages = c.Messages
                .OrderBy(m => m.CreatedAt)
                .Select(m => new MessageDto
                {
                    Role = m.Role,
                    Content = m.Content,
                    CreatedAt = m.CreatedAt
                })
                .ToList()
        });

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var conversation = await _conversationRepository.GetByIdAsync(id);

        if (conversation == null)
            return NotFound();

        var result = new ConversationDto
        {
            Id = conversation.Id,
            SessionId = conversation.SessionId,
            StartedAt = conversation.StartedAt,
            Messages = conversation.Messages
                .OrderBy(m => m.CreatedAt)
                .Select(m => new MessageDto
                {
                    Role = m.Role,
                    Content = m.Content,
                    CreatedAt = m.CreatedAt
                })
                .ToList()
        };

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var conversation = await _conversationRepository.GetByIdAsync(id);

        if (conversation == null)
            return NotFound();

        await _conversationRepository.DeleteAsync(conversation);

        return NoContent();
    }
}