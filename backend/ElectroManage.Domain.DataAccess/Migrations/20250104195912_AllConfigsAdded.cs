using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectroManage.Domain.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AllConfigsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUsers_ManagementTeam_ManagementTeamId",
                table: "AppUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_EquipmentInstance_EquipmentSpecification_EquipmentSpecifica~",
                table: "EquipmentInstance");

            migrationBuilder.DropForeignKey(
                name: "FK_EquipmentInstance_Office_OfficeId",
                table: "EquipmentInstance");

            migrationBuilder.DropForeignKey(
                name: "FK_EquipmentSpecification_EquipmentBrand_EquipmentBrandId",
                table: "EquipmentSpecification");

            migrationBuilder.DropForeignKey(
                name: "FK_EquipmentSpecification_EquipmentType_EquipmentTypeId",
                table: "EquipmentSpecification");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUsers_ManagementTeam_ManagementTeamId",
                table: "AppUsers",
                column: "ManagementTeamId",
                principalTable: "ManagementTeam",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_EquipmentInstance_EquipmentSpecification_EquipmentSpecifica~",
                table: "EquipmentInstance",
                column: "EquipmentSpecificationId",
                principalTable: "EquipmentSpecification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EquipmentInstance_Office_OfficeId",
                table: "EquipmentInstance",
                column: "OfficeId",
                principalTable: "Office",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EquipmentSpecification_EquipmentBrand_EquipmentBrandId",
                table: "EquipmentSpecification",
                column: "EquipmentBrandId",
                principalTable: "EquipmentBrand",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EquipmentSpecification_EquipmentType_EquipmentTypeId",
                table: "EquipmentSpecification",
                column: "EquipmentTypeId",
                principalTable: "EquipmentType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUsers_ManagementTeam_ManagementTeamId",
                table: "AppUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_EquipmentInstance_EquipmentSpecification_EquipmentSpecifica~",
                table: "EquipmentInstance");

            migrationBuilder.DropForeignKey(
                name: "FK_EquipmentInstance_Office_OfficeId",
                table: "EquipmentInstance");

            migrationBuilder.DropForeignKey(
                name: "FK_EquipmentSpecification_EquipmentBrand_EquipmentBrandId",
                table: "EquipmentSpecification");

            migrationBuilder.DropForeignKey(
                name: "FK_EquipmentSpecification_EquipmentType_EquipmentTypeId",
                table: "EquipmentSpecification");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUsers_ManagementTeam_ManagementTeamId",
                table: "AppUsers",
                column: "ManagementTeamId",
                principalTable: "ManagementTeam",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EquipmentInstance_EquipmentSpecification_EquipmentSpecifica~",
                table: "EquipmentInstance",
                column: "EquipmentSpecificationId",
                principalTable: "EquipmentSpecification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EquipmentInstance_Office_OfficeId",
                table: "EquipmentInstance",
                column: "OfficeId",
                principalTable: "Office",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EquipmentSpecification_EquipmentBrand_EquipmentBrandId",
                table: "EquipmentSpecification",
                column: "EquipmentBrandId",
                principalTable: "EquipmentBrand",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EquipmentSpecification_EquipmentType_EquipmentTypeId",
                table: "EquipmentSpecification",
                column: "EquipmentTypeId",
                principalTable: "EquipmentType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
