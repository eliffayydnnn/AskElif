namespace AskElif.API.Interfaces;

public interface IChatService
{
    Task<string> AskAsync(string question);
}