namespace AskElif.API.DTOs;

public class UpdateKnowledgeDto
{
    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string Source { get; set; } = string.Empty;

    public string Tags { get; set; } = string.Empty;

    public int Priority { get; set; }

    public bool IsPublished { get; set; }
}