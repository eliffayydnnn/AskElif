using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UnknownQuestionsController : ControllerBase
{
    private readonly IUnknownQuestionRepository _repository;
    private readonly IKnowledgeService _knowledgeService;

    public UnknownQuestionsController(
        IUnknownQuestionRepository repository,
        IKnowledgeService knowledgeService)
    {
        _repository = repository;
        _knowledgeService = knowledgeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var questions = await _repository.GetAllAsync();

        return Ok(questions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var question = await _repository.GetByIdAsync(id);

        if (question == null)
            return NotFound();

        return Ok(question);
    }

    [HttpPost("{id}/convert-to-knowledge")]
    public async Task<IActionResult> ConvertToKnowledge(
        int id,
        CreateKnowledgeDto dto)
    {
        var question = await _repository.GetByIdAsync(id);

        if (question == null)
            return NotFound();

        if (question.IsResolved)
        {
            return BadRequest(new
            {
                message = "Bu soru zaten çözüldü."
            });
        }

        // Knowledge oluştur
        var knowledge =
            await _knowledgeService.CreateAsync(dto);

        // Unknown Question çözüldü olarak işaretle
        question.IsResolved = true;

        await _repository.UpdateAsync(question);

        return Ok(new
        {
            message = "Unknown Question başarıyla Knowledge'a dönüştürüldü.",
            unknownQuestion = question,
            knowledge
        });
    }

    [HttpPut("{id}/resolve")]
    public async Task<IActionResult> Resolve(int id)
    {
        var question = await _repository.GetByIdAsync(id);

        if (question == null)
            return NotFound();

        question.IsResolved = true;

        await _repository.UpdateAsync(question);

        return Ok(question);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var question = await _repository.GetByIdAsync(id);

        if (question == null)
            return NotFound();

        await _repository.DeleteAsync(question);

        return NoContent();
    }
}