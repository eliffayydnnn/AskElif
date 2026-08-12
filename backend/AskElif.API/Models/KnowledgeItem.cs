namespace AskElif.API.Models;

public class KnowledgeItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    // Bilginin kaynağı (CV, GitHub, LinkedIn, Proje...)
    public string Source { get; set; } = string.Empty;

    // Anahtar kelimeler
    public string Tags { get; set; } = string.Empty;

    // Bilginin önceliği
    public int Priority { get; set; } = 1;

    // Admin panelinde yayında mı?
    public bool IsPublished { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Jina Embedding v3 tarafından oluşturulan 1024 boyutlu vector
    public string? Embedding { get; set; }
}