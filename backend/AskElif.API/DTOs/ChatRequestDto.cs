namespace AskElif.API.DTOs;

public class ChatRequestDto
{
    public int? ConversationId { get; set; }

    public string Message { get; set; } = string.Empty;
}