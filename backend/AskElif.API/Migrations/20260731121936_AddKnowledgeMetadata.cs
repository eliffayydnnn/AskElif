using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AskElif.API.Migrations
{
    /// <inheritdoc />
    public partial class AddKnowledgeMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "KnowledgeItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "KnowledgeItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "KnowledgeItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "KnowledgeItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "KnowledgeItems");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "KnowledgeItems");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "KnowledgeItems");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "KnowledgeItems");
        }
    }
}
