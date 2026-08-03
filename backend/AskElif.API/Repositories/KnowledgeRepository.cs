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
        var lowerQuestion = question.ToLower();

        return await _context.KnowledgeItems
            .Where(x =>
                x.IsPublished &&
                (
                    x.Title.ToLower().Contains(lowerQuestion) ||
                    x.Category.ToLower().Contains(lowerQuestion) ||
                    x.Content.ToLower().Contains(lowerQuestion) ||
                    x.Tags.ToLower().Contains(lowerQuestion)
                ))
            .OrderByDescending(x => x.Priority)
            .FirstOrDefaultAsync();
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