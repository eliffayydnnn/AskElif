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

    public DbSet<Conversation> Conversations { get; set; }

    public DbSet<Message> Messages { get; set; }

    public DbSet<UnknownQuestion> UnknownQuestions { get; set; }

    public DbSet<AdminUser> AdminUsers { get; set; }
}