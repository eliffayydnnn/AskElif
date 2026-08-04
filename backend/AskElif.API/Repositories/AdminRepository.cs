using AskElif.API.Data;
using AskElif.API.Interfaces;
using AskElif.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AskElif.API.Repositories;

public class AdminRepository : IAdminRepository
{
    private readonly ApplicationDbContext _context;

    public AdminRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AdminUser?> GetByEmailAsync(string email)
    {
        return await _context.AdminUsers
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task AddAsync(AdminUser adminUser)
    {
        await _context.AdminUsers.AddAsync(adminUser);
        await _context.SaveChangesAsync();
    }
}