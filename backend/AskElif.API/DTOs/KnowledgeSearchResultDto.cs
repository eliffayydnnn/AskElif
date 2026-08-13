using AskElif.API.Models;

namespace AskElif.API.DTOs;

public class KnowledgeSearchResultDto
{
    public KnowledgeItem Item { get; set; } = null!;

    public double SimilarityScore { get; set; }
}