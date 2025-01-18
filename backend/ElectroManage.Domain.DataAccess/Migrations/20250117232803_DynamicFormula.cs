using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ElectroManage.Domain.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class DynamicFormula : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtraPerCent",
                table: "CostFormula");

            migrationBuilder.DropColumn(
                name: "Increase",
                table: "CostFormula");

            migrationBuilder.AddColumn<string>(
                name: "Expression",
                table: "CostFormula",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "CostFormula",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VariableDefinition",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    StaticValue = table.Column<double>(type: "double precision", nullable: true),
                    Expression = table.Column<string>(type: "text", nullable: false),
                    FormulaId = table.Column<long>(type: "bigint", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariableDefinition", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariableDefinition_CostFormula_FormulaId",
                        column: x => x.FormulaId,
                        principalTable: "CostFormula",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VariableDefinition_FormulaId",
                table: "VariableDefinition",
                column: "FormulaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VariableDefinition");

            migrationBuilder.DropColumn(
                name: "Expression",
                table: "CostFormula");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "CostFormula");

            migrationBuilder.AddColumn<decimal>(
                name: "ExtraPerCent",
                table: "CostFormula",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<long>(
                name: "Increase",
                table: "CostFormula",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
