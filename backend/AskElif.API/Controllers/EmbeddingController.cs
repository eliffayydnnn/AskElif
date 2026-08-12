using AskElif.API.Interfaces;
using AskElif.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmbeddingController : ControllerBase
{
    private readonly IEmbeddingService _embeddingService;
    private readonly KnowledgeEmbeddingService _knowledgeEmbeddingService;

    public EmbeddingController(
        IEmbeddingService embeddingService,
        KnowledgeEmbeddingService knowledgeEmbeddingService)
    {
        _embeddingService = embeddingService;
        _knowledgeEmbeddingService = knowledgeEmbeddingService;
    }

    [HttpPost("test")]
    public async Task<IActionResult> Test([FromBody] string text)
    {
        var embedding =
            await _embeddingService.GenerateEmbeddingAsync(text);

        return Ok(new
        {
            success = true,
            dimension = embedding.Length,
            firstValues = embedding.Take(10)
        });
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate()
    {
        await _knowledgeEmbeddingService.GenerateEmbeddingsAsync();

        return Ok(new
        {
            success = true,
            message = "Knowledge embedding'leri oluşturuldu."
        });
    }
}