using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectroManage.Domain.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class EffPCompIentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "EfficiencyPolicyCompany",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModified",
                table: "EfficiencyPolicyCompany",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StatusBaseEntity",
                table: "EfficiencyPolicyCompany",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Created",
                table: "EfficiencyPolicyCompany");

            migrationBuilder.DropColumn(
                name: "LastModified",
                table: "EfficiencyPolicyCompany");

            migrationBuilder.DropColumn(
                name: "StatusBaseEntity",
                table: "EfficiencyPolicyCompany");
        }
    }
}
