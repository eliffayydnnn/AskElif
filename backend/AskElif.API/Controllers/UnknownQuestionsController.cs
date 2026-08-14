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

    // =========================
    // TÜM UNKNOWN QUESTIONS
    // =========================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var questions =
            await _repository.GetAllAsync();

        return Ok(questions);
    }

    // =========================
    // TEK UNKNOWN QUESTION
    // =========================

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var question =
            await _repository.GetByIdAsync(id);

        if (question == null)
            return NotFound();

        return Ok(question);
    }

    // =========================
    // UNKNOWN QUESTION
    // -> KNOWLEDGE
    // =========================

    [HttpPost("{id}/convert-to-knowledge")]
    public async Task<IActionResult> ConvertToKnowledge(
        int id,
        ConvertUnknownQuestionDto dto)
    {
        var question =
            await _repository.GetByIdAsync(id);

        if (question == null)
        {
            return NotFound(new
            {
                message = "Unknown Question bulunamadı."
            });
        }

        if (question.IsResolved)
        {
            return BadRequest(new
            {
                message = "Bu soru zaten çözüldü."
            });
        }

        // =========================
        // VALIDATION
        // =========================

        if (string.IsNullOrWhiteSpace(dto.Answer))
        {
            return BadRequest(new
            {
                message = "Cevap boş olamaz."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.Category))
        {
            return BadRequest(new
            {
                message = "Kategori boş olamaz."
            });
        }

        // =========================
        // KNOWLEDGE OLUŞTUR
        // =========================

        var knowledgeDto =
            new CreateKnowledgeDto
            {
                Title = question.Question,

                Category = dto.Category,

                Content = dto.Answer,

                Source = "Unknown Question",

                Tags = "unknown-question",

                Priority = 1,

                IsPublished = true
            };

        var knowledge =
            await _knowledgeService.CreateAsync(
                knowledgeDto);

        // =========================
        // UNKNOWN QUESTION ÇÖZÜLDÜ
        // =========================

        question.IsResolved = true;

        await _repository.UpdateAsync(
            question);

        // =========================
        // RESPONSE
        // =========================

        return Ok(new
        {
            message =
                "Unknown Question başarıyla Knowledge'a dönüştürüldü.",

            unknownQuestion = question,

            knowledge = knowledge
        });
    }

    // =========================
    // ÇÖZÜLDÜ
    // =========================

    [HttpPut("{id}/resolve")]
    public async Task<IActionResult> Resolve(int id)
    {
        var question =
            await _repository.GetByIdAsync(id);

        if (question == null)
            return NotFound();

        question.IsResolved = true;

        await _repository.UpdateAsync(
            question);

        return Ok(question);
    }

    // =========================
    // SİL
    // =========================

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var question =
            await _repository.GetByIdAsync(id);

        if (question == null)
            return NotFound();

        await _repository.DeleteAsync(
            question);

        return NoContent();
    }
}