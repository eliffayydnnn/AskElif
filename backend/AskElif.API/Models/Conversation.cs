namespace AskElif.API.Models;

public class Conversation
{
    public int Id { get; set; }

    // Tarayıcıdaki her kullanıcı için benzersiz bir oturum kimliği
    public string SessionId { get; set; } = Guid.NewGuid().ToString();

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;

    public DateTime? EndedAt { get; set; }

    public ICollection<Message> Messages { get; set; } = new List<Message>();
}