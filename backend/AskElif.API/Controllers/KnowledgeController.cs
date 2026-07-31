using AskElif.API.Interfaces;
using AskElif.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KnowledgeController : ControllerBase
{
    private readonly IKnowledgeRepository _repository;

    public KnowledgeController(IKnowledgeRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var knowledgeItems = await _repository.GetAllAsync();
        return Ok(knowledgeItems);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var knowledgeItem = await _repository.GetByIdAsync(id);

        if (knowledgeItem == null)
            return NotFound();

        return Ok(knowledgeItem);
    }

    [HttpPost]
    public async Task<IActionResult> Create(KnowledgeItem knowledgeItem)
    {
        await _repository.AddAsync(knowledgeItem);

        return CreatedAtAction(
            nameof(GetById),
            new { id = knowledgeItem.Id },
            knowledgeItem);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, KnowledgeItem updatedItem)
    {
        var knowledgeItem = await _repository.GetByIdAsync(id);

        if (knowledgeItem == null)
            return NotFound();

        knowledgeItem.Title = updatedItem.Title;
        knowledgeItem.Category = updatedItem.Category;
        knowledgeItem.Content = updatedItem.Content;
        knowledgeItem.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(knowledgeItem);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var knowledgeItem = await _repository.GetByIdAsync(id);

        if (knowledgeItem == null)
            return NotFound();

        await _repository.DeleteAsync(knowledgeItem);

        return NoContent();
    }
}