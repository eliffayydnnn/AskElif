using AskElif.API.Models;

namespace AskElif.API.Interfaces;

public interface IAdminRepository
{
    Task<AdminUser?> GetByEmailAsync(string email);

    Task AddAsync(AdminUser adminUser);
}