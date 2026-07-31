using Microsoft.EntityFrameworkCore;
using AskElif.API.Models;

namespace AskElif.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<KnowledgeItem> KnowledgeItems { get; set; }
}