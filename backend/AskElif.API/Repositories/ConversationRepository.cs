using AskElif.API.Data;
using AskElif.API.Interfaces;
using AskElif.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AskElif.API.Repositories;

public class ConversationRepository : IConversationRepository
{
    private readonly ApplicationDbContext _context;

    public ConversationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Conversation> AddAsync(Conversation conversation)
    {
        await _context.Conversations.AddAsync(conversation);
        await _context.SaveChangesAsync();

        return conversation;
    }

    public async Task<Conversation?> GetByIdAsync(int id)
    {
        return await _context.Conversations
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Conversation> CreateIfNotExistsAsync(int? conversationId)
    {
        if (conversationId.HasValue)
        {
            var existingConversation = await GetByIdAsync(conversationId.Value);

            if (existingConversation != null)
            {
                return existingConversation;
            }
        }

        var newConversation = new Conversation();

        await AddAsync(newConversation);

        return newConversation;
    }
}