using AskElif.API.DTOs;

namespace AskElif.API.Interfaces;

public interface IChatService
{
    Task<ChatResultDto> AskAsync(int? conversationId, string question);
}