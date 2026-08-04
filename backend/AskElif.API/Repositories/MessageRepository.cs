using AskElif.API.Data;
using AskElif.API.Interfaces;
using AskElif.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AskElif.API.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly ApplicationDbContext _context;

    public MessageRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Message message)
    {
        await _context.Messages.AddAsync(message);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Message>> GetByConversationIdAsync(int conversationId)
    {
        return await _context.Messages
            .Where(x => x.ConversationId == conversationId)
            .OrderBy(x => x.CreatedAt)
            .ToListAsync();
    }
}