using AskElif.API.Models;

namespace AskElif.API.Interfaces;

public interface IMessageRepository
{
    Task AddAsync(Message message);
}