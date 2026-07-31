namespace AskElif.API.Models;

public class Message
{
    public int Id { get; set; }

    public int ConversationId { get; set; }

    public Conversation Conversation { get; set; } = null!;

    // User veya Assistant
    public string Role { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}