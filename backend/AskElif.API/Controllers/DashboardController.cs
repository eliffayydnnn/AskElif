using AskElif.API.Data;
using AskElif.API.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var dashboard = new DashboardDto
        {
            KnowledgeCount = _context.KnowledgeItems.Count(),
            ConversationCount = _context.Conversations.Count(),
            MessageCount = _context.Messages.Count(),
            UnknownQuestionCount = _context.UnknownQuestions.Count()
        };

        return Ok(dashboard);
    }
}