using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectroManage.Domain.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class PolicyApplyed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyEfficiencyPolicy");

            migrationBuilder.DropColumn(
                name: "ApplyingDate",
                table: "EfficiencyPolicy");

            migrationBuilder.CreateTable(
                name: "EfficiencyPolicyCompany",
                columns: table => new
                {
                    EfficiencyPolicyId = table.Column<long>(type: "bigint", nullable: false),
                    CompanyId = table.Column<long>(type: "bigint", nullable: false),
                    ApplyingDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    To = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EfficiencyPolicyCompany", x => new { x.EfficiencyPolicyId, x.CompanyId, x.ApplyingDate });
                    table.ForeignKey(
                        name: "FK_EfficiencyPolicyCompany_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EfficiencyPolicyCompany_EfficiencyPolicy_EfficiencyPolicyId",
                        column: x => x.EfficiencyPolicyId,
                        principalTable: "EfficiencyPolicy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EfficiencyPolicyCompany_CompanyId",
                table: "EfficiencyPolicyCompany",
                column: "CompanyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EfficiencyPolicyCompany");

            migrationBuilder.AddColumn<DateTime>(
                name: "ApplyingDate",
                table: "EfficiencyPolicy",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "CompanyEfficiencyPolicy",
                columns: table => new
                {
                    CompaniesId = table.Column<long>(type: "bigint", nullable: false),
                    EfficiencyPoliciesId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyEfficiencyPolicy", x => new { x.CompaniesId, x.EfficiencyPoliciesId });
                    table.ForeignKey(
                        name: "FK_CompanyEfficiencyPolicy_Company_CompaniesId",
                        column: x => x.CompaniesId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompanyEfficiencyPolicy_EfficiencyPolicy_EfficiencyPolicies~",
                        column: x => x.EfficiencyPoliciesId,
                        principalTable: "EfficiencyPolicy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyEfficiencyPolicy_EfficiencyPoliciesId",
                table: "CompanyEfficiencyPolicy",
                column: "EfficiencyPoliciesId");
        }
    }
}
