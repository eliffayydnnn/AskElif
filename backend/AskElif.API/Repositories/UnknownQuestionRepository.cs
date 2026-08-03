using AskElif.API.Data;
using AskElif.API.Interfaces;
using AskElif.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AskElif.API.Repositories;

public class UnknownQuestionRepository : IUnknownQuestionRepository
{
    private readonly ApplicationDbContext _context;

    public UnknownQuestionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UnknownQuestion>> GetAllAsync()
    {
        return await _context.UnknownQuestions.ToListAsync();
    }

    public async Task<UnknownQuestion?> GetByIdAsync(int id)
    {
        return await _context.UnknownQuestions.FindAsync(id);
    }

    public async Task AddAsync(UnknownQuestion question)
    {
        await _context.UnknownQuestions.AddAsync(question);
        await _context.SaveChangesAsync();
    }
}