using AskElif.API.DTOs;

namespace AskElif.API.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
}