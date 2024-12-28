using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectroManage.Domain.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class LocationRestructured : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BetweenStreets",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "Neighborhood",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "Number",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "Province",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "Street",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "Town",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "ZipCode",
                table: "Location");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Location",
                newName: "AddressDetails");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AddressDetails",
                table: "Location",
                newName: "Description");

            migrationBuilder.AddColumn<string>(
                name: "BetweenStreets",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Neighborhood",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Number",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Province",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Street",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Town",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "ZipCode",
                table: "Location",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
