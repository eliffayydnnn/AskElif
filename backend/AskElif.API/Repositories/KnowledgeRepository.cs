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

    public async Task<KnowledgeItem?> SearchAsync(string question)
{
    var questionLower = question.ToLower();

    var words = questionLower
        .Replace("?", "")
        .Replace(".", "")
        .Replace(",", "")
        .Split(' ', StringSplitOptions.RemoveEmptyEntries);

    var knowledgeItems = await _context.KnowledgeItems
        .Where(x => x.IsPublished)
        .ToListAsync();

    return knowledgeItems
        .Where(item =>
        {
            var title = item.Title.ToLower();
            var category = item.Category.ToLower();
            var content = item.Content.ToLower();
            var tags = item.Tags.ToLower();

            return words.Any(word =>
                title.Contains(word) ||
                word.Contains(title) ||

                category.Contains(word) ||
                word.Contains(category) ||

                content.Contains(word) ||

                tags.Contains(word)
            );
        })
        .OrderByDescending(x => x.Priority)
        .FirstOrDefault();
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