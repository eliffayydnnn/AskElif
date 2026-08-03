using AskElif.API.Models;

namespace AskElif.API.Interfaces;

public interface IUnknownQuestionRepository
{
    Task<List<UnknownQuestion>> GetAllAsync();

    Task<UnknownQuestion?> GetByIdAsync(int id);

    Task AddAsync(UnknownQuestion question);
}