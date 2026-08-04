using AskElif.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnknownQuestionsController : ControllerBase
{
    private readonly IUnknownQuestionRepository _repository;

    public UnknownQuestionsController(IUnknownQuestionRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var questions = await _repository.GetAllAsync();
        return Ok(questions);
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