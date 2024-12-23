using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectroManage.Domain.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class LimitWithOneCompany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyConsumptionLimit");

            migrationBuilder.AddColumn<long>(
                name: "CompanyId",
                table: "ConsumptionLimit",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionLimit_CompanyId",
                table: "ConsumptionLimit",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConsumptionLimit_Company_CompanyId",
                table: "ConsumptionLimit",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConsumptionLimit_Company_CompanyId",
                table: "ConsumptionLimit");

            migrationBuilder.DropIndex(
                name: "IX_ConsumptionLimit_CompanyId",
                table: "ConsumptionLimit");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "ConsumptionLimit");

            migrationBuilder.CreateTable(
                name: "CompanyConsumptionLimit",
                columns: table => new
                {
                    CompaniesId = table.Column<long>(type: "bigint", nullable: false),
                    ConsumptionLimitsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyConsumptionLimit", x => new { x.CompaniesId, x.ConsumptionLimitsId });
                    table.ForeignKey(
                        name: "FK_CompanyConsumptionLimit_Company_CompaniesId",
                        column: x => x.CompaniesId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompanyConsumptionLimit_ConsumptionLimit_ConsumptionLimitsId",
                        column: x => x.ConsumptionLimitsId,
                        principalTable: "ConsumptionLimit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyConsumptionLimit_ConsumptionLimitsId",
                table: "CompanyConsumptionLimit",
                column: "ConsumptionLimitsId");
        }
    }
}
