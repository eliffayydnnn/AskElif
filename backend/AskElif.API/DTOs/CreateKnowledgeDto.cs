namespace AskElif.API.DTOs;

public class CreateKnowledgeDto
{
    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string Source { get; set; } = string.Empty;

    public string Tags { get; set; } = string.Empty;

    public int Priority { get; set; } = 1;

    public bool IsPublished { get; set; } = true;
}