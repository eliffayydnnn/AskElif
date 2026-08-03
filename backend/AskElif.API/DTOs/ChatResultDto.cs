namespace AskElif.API.DTOs;

public class ChatResultDto
{
    public int ConversationId { get; set; }

    public string Answer { get; set; } = string.Empty;

    public bool IsAnswered { get; set; }
}