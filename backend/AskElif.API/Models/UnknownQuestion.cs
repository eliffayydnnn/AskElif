namespace AskElif.API.Models;

public class UnknownQuestion
{
    public int Id { get; set; }

    public string Question { get; set; } = string.Empty;

    public DateTime AskedAt { get; set; } = DateTime.UtcNow;

    public bool IsResolved { get; set; } = false;
}