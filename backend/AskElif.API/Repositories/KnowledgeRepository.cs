using AskElif.API.Data;
using AskElif.API.Interfaces;
using AskElif.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AskElif.API.Repositories;

public class KnowledgeRepository : IKnowledgeRepository
{
    private readonly ApplicationDbContext _context;

    public KnowledgeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<KnowledgeItem>> GetAllAsync()
    {
        return await _context.KnowledgeItems.ToListAsync();
    }

    public async Task<KnowledgeItem?> GetByIdAsync(int id)
    {
        return await _context.KnowledgeItems.FindAsync(id);
    }

    public async Task<List<KnowledgeItem>> SearchAsync(string question)
    {
        var questionLower = question
            .ToLowerInvariant()
            .Replace("?", "")
            .Replace(".", "")
            .Replace(",", "")
            .Replace("!", "")
            .Replace(":", "")
            .Replace(";", "");

        var words = questionLower
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Where(word => word.Length >= 3)
            .ToList();

        var knowledgeItems = await _context.KnowledgeItems
            .Where(x => x.IsPublished)
            .ToListAsync();

        if (!knowledgeItems.Any())
            return new List<KnowledgeItem>();

        var results = knowledgeItems
            .Select(item =>
            {
                var title = item.Title.ToLowerInvariant();
                var category = item.Category.ToLowerInvariant();
                var content = item.Content.ToLowerInvariant();
                var tags = item.Tags.ToLowerInvariant();

                var searchableText =
                    $"{title} {category} {content} {tags}";

                var score = 0;

                foreach (var word in words)
                {
                    // Direkt eşleşme
                    if (searchableText.Contains(word))
                    {
                        score += 1;
                    }

                    // Kelime kökü eşleşmesi
                    var normalizedWord = NormalizeTurkishWord(word);

                    if (searchableText.Contains(normalizedWord))
                    {
                        score += 2;
                    }

                    // Başlık eşleşmesi daha önemli
                    if (title.Contains(word))
                    {
                        score += 4;
                    }

                    // Tag eşleşmesi önemli
                    if (tags.Contains(word))
                    {
                        score += 3;
                    }

                    // Kategori eşleşmesi
                    if (category.Contains(word))
                    {
                        score += 2;
                    }
                }

                return new
                {
                    Item = item,
                    Score = score
                };
            })
            .Where(x => x.Score > 0)
            .OrderByDescending(x => x.Score)
            .ThenByDescending(x => x.Item.Priority)
            .Take(5)
            .Select(x => x.Item)
            .ToList();

        return results;
    }

    private string NormalizeTurkishWord(string word)
    {
        var normalized = word.ToLowerInvariant();

        var endings = new[]
        {
            "lerinden",
            "larından",
            "lerden",
            "lardan",
            "lerin",
            "ların",
            "leri",
            "ları",
            "inden",
            "ından",
            "undan",
            "ünden",
            "den",
            "dan",
            "ten",
            "tan",
            "dir",
            "dır",
            "dur",
            "dür",
            "tir",
            "tır",
            "tur",
            "tür",
            "nin",
            "nın",
            "nun",
            "nün",
            "in",
            "ın",
            "un",
            "ün",
            "i",
            "ı",
            "u",
            "ü"
        };

        foreach (var ending in endings.OrderByDescending(x => x.Length))
        {
            if (normalized.Length > ending.Length + 2 &&
                normalized.EndsWith(ending))
            {
                normalized = normalized[..^ending.Length];
                break;
            }
        }

        return normalized;
    }

    public async Task AddAsync(KnowledgeItem knowledgeItem)
    {
        await _context.KnowledgeItems.AddAsync(knowledgeItem);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(KnowledgeItem knowledgeItem)
    {
        _context.KnowledgeItems.Update(knowledgeItem);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(KnowledgeItem knowledgeItem)
    {
        _context.KnowledgeItems.Remove(knowledgeItem);
        await _context.SaveChangesAsync();
    }
}