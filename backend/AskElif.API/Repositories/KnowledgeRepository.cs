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