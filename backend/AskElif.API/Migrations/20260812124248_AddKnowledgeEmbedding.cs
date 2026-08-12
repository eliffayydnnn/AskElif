using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AskElif.API.Migrations
{
    /// <inheritdoc />
    public partial class AddKnowledgeEmbedding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Embedding",
                table: "KnowledgeItems",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Embedding",
                table: "KnowledgeItems");
        }
    }
}
