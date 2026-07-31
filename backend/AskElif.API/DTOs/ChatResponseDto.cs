namespace AskElif.API.DTOs;

public class ChatResponseDto
{
    public string Answer { get; set; } = string.Empty;

    public bool IsAnswered { get; set; }
}