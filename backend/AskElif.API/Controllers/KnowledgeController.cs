using AskElif.API.DTOs;
using AskElif.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AskElif.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KnowledgeController : ControllerBase
{
    private readonly IKnowledgeService _service;

    public KnowledgeController(IKnowledgeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var knowledgeItems = await _service.GetAllAsync();
        return Ok(knowledgeItems);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var knowledgeItem = await _service.GetByIdAsync(id);

        if (knowledgeItem == null)
            return NotFound();

        return Ok(knowledgeItem);
    }

 [HttpPost]
public async Task<IActionResult> Create(CreateKnowledgeDto dto)
{
    try
    {
        var created = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            created);
    }
    catch (Exception ex)
    {
        Console.WriteLine("===== KNOWLEDGE CREATE ERROR =====");
        Console.WriteLine(ex.ToString());
        Console.WriteLine("=================================");

        return StatusCode(500, new
        {
            message = "Knowledge oluşturulurken hata oluştu.",
            error = ex.Message
        });
    }
}

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateKnowledgeDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}