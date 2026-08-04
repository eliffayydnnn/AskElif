using AskElif.API.Models;

namespace AskElif.API.Interfaces;

public interface IUnknownQuestionRepository
{
    Task AddAsync(UnknownQuestion question);

    Task<List<UnknownQuestion>> GetAllAsync();

    Task<UnknownQuestion?> GetByIdAsync(int id);

    Task UpdateAsync(UnknownQuestion question);

    Task DeleteAsync(UnknownQuestion question);
}