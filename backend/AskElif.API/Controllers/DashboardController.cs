using AskElif.API.Data;
using AskElif.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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

            UnknownQuestionCount = _context.UnknownQuestions.Count(q => !q.IsResolved),

            RecentConversations = _context.Conversations
                .Include(c => c.Messages)
                .OrderByDescending(c => c.StartedAt)
                .Take(5)
                .Select(c => new RecentConversationDto
                {
                    Id = c.Id,

                    Question = c.Messages
                        .OrderBy(m => m.CreatedAt)
                        .Select(m => m.Content)
                        .FirstOrDefault() ?? "Konuşma",

                    CreatedAt = c.StartedAt
                })
                .ToList(),

            RecentUnknownQuestions = _context.UnknownQuestions
                .Where(q => !q.IsResolved)
                .OrderByDescending(q => q.AskedAt)
                .Take(5)
                .Select(q => new UnknownQuestionDto
                {
                    Id = q.Id,

                    Question = q.Question,

                    IsResolved = q.IsResolved
                })
                .ToList()
        };

        return Ok(dashboard);
    }
}