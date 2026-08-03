using AskElif.API.Models;

namespace AskElif.API.Interfaces;

public interface IConversationRepository
{
    Task<Conversation> AddAsync(Conversation conversation);

    Task<Conversation?> GetByIdAsync(int id);

    Task<Conversation> CreateIfNotExistsAsync(int? conversationId);
}