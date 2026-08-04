namespace AskElif.API.DTOs;

public class ConversationDto
{
    public int Id { get; set; }

    public string SessionId { get; set; } = string.Empty;

    public DateTime StartedAt { get; set; }

    public List<MessageDto> Messages { get; set; } = new();
}