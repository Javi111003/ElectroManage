using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ElectroManage.Domain.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddDomain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CompanyId",
                table: "AppUsers",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "ManagementTeamId",
                table: "AppUsers",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AministrativeArea",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AministrativeArea", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ConsumptionLimit",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Limit = table.Column<decimal>(type: "numeric", nullable: false),
                    ApplyingDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsumptionLimit", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EfficiencyPolicy",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ApplyingDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EfficiencyPolicy", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentBrand",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentBrand", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentType",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InstalationType",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstalationType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Location",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Street = table.Column<string>(type: "text", nullable: false),
                    Number = table.Column<string>(type: "text", nullable: false),
                    BetweenStreets = table.Column<string>(type: "text", nullable: false),
                    Neighborhood = table.Column<string>(type: "text", nullable: false),
                    Town = table.Column<string>(type: "text", nullable: false),
                    ZipCode = table.Column<long>(type: "bigint", nullable: false),
                    Province = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Location", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentSpecification",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Model = table.Column<string>(type: "text", nullable: false),
                    Capacity = table.Column<decimal>(type: "numeric", nullable: false),
                    CriticalEnergySystem = table.Column<bool>(type: "boolean", nullable: false),
                    AverageConsumption = table.Column<decimal>(type: "numeric", nullable: false),
                    LifeSpanYears = table.Column<int>(type: "integer", nullable: false),
                    Efficiency = table.Column<decimal>(type: "numeric", nullable: false),
                    EquipmentBrandId = table.Column<long>(type: "bigint", nullable: false),
                    EquipmentTypeId = table.Column<long>(type: "bigint", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentSpecification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EquipmentSpecification_EquipmentBrand_EquipmentBrandId",
                        column: x => x.EquipmentBrandId,
                        principalTable: "EquipmentBrand",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EquipmentSpecification_EquipmentType_EquipmentTypeId",
                        column: x => x.EquipmentTypeId,
                        principalTable: "EquipmentType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    InstalationTypeId = table.Column<long>(type: "bigint", nullable: false),
                    AministrativeAreaId = table.Column<long>(type: "bigint", nullable: false),
                    LocationId = table.Column<long>(type: "bigint", nullable: false),
                    ManagementTeamId = table.Column<long>(type: "bigint", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Company_AministrativeArea_AministrativeAreaId",
                        column: x => x.AministrativeAreaId,
                        principalTable: "AministrativeArea",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Company_InstalationType_InstalationTypeId",
                        column: x => x.InstalationTypeId,
                        principalTable: "InstalationType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Company_Location_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateTable(
                name: "CostFormula",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ExtraPerCent = table.Column<decimal>(type: "numeric", nullable: false),
                    Increase = table.Column<long>(type: "bigint", nullable: false),
                    ApplyingDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CompanyId = table.Column<long>(type: "bigint", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostFormula", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CostFormula_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ManagementTeam",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    CompanyId = table.Column<long>(type: "bigint", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManagementTeam", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ManagementTeam_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Office",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CompanyId = table.Column<long>(type: "bigint", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Office", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Office_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Register",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Cost = table.Column<decimal>(type: "numeric", nullable: false),
                    Consumption = table.Column<decimal>(type: "numeric", nullable: false),
                    CompanyId = table.Column<long>(type: "bigint", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Register", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Register_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Warning",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EstablishedLimit = table.Column<decimal>(type: "numeric", nullable: false),
                    Consumption = table.Column<decimal>(type: "numeric", nullable: false),
                    CompanyId = table.Column<long>(type: "bigint", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Warning", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Warning_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentInstance",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InstalationDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    MantainceStatus = table.Column<int>(type: "integer", nullable: false),
                    UseFrequency = table.Column<int>(type: "integer", nullable: false),
                    EquipmentSpecificationId = table.Column<long>(type: "bigint", nullable: false),
                    OfficeId = table.Column<long>(type: "bigint", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusBaseEntity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentInstance", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EquipmentInstance_EquipmentSpecification_EquipmentSpecifica~",
                        column: x => x.EquipmentSpecificationId,
                        principalTable: "EquipmentSpecification",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EquipmentInstance_Office_OfficeId",
                        column: x => x.OfficeId,
                        principalTable: "Office",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_CompanyId",
                table: "AppUsers",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_ManagementTeamId",
                table: "AppUsers",
                column: "ManagementTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Company_AministrativeAreaId",
                table: "Company",
                column: "AministrativeAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Company_InstalationTypeId",
                table: "Company",
                column: "InstalationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Company_LocationId",
                table: "Company",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyConsumptionLimit_ConsumptionLimitsId",
                table: "CompanyConsumptionLimit",
                column: "ConsumptionLimitsId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyEfficiencyPolicy_EfficiencyPoliciesId",
                table: "CompanyEfficiencyPolicy",
                column: "EfficiencyPoliciesId");

            migrationBuilder.CreateIndex(
                name: "IX_CostFormula_CompanyId",
                table: "CostFormula",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentInstance_EquipmentSpecificationId",
                table: "EquipmentInstance",
                column: "EquipmentSpecificationId");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentInstance_OfficeId",
                table: "EquipmentInstance",
                column: "OfficeId");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentSpecification_EquipmentBrandId",
                table: "EquipmentSpecification",
                column: "EquipmentBrandId");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentSpecification_EquipmentTypeId",
                table: "EquipmentSpecification",
                column: "EquipmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ManagementTeam_CompanyId",
                table: "ManagementTeam",
                column: "CompanyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Office_CompanyId",
                table: "Office",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Register_CompanyId",
                table: "Register",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Warning_CompanyId",
                table: "Warning",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUsers_Company_CompanyId",
                table: "AppUsers",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AppUsers_ManagementTeam_ManagementTeamId",
                table: "AppUsers",
                column: "ManagementTeamId",
                principalTable: "ManagementTeam",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUsers_Company_CompanyId",
                table: "AppUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_AppUsers_ManagementTeam_ManagementTeamId",
                table: "AppUsers");

            migrationBuilder.DropTable(
                name: "CompanyConsumptionLimit");

            migrationBuilder.DropTable(
                name: "CompanyEfficiencyPolicy");

            migrationBuilder.DropTable(
                name: "CostFormula");

            migrationBuilder.DropTable(
                name: "EquipmentInstance");

            migrationBuilder.DropTable(
                name: "ManagementTeam");

            migrationBuilder.DropTable(
                name: "Register");

            migrationBuilder.DropTable(
                name: "Warning");

            migrationBuilder.DropTable(
                name: "ConsumptionLimit");

            migrationBuilder.DropTable(
                name: "EfficiencyPolicy");

            migrationBuilder.DropTable(
                name: "EquipmentSpecification");

            migrationBuilder.DropTable(
                name: "Office");

            migrationBuilder.DropTable(
                name: "EquipmentBrand");

            migrationBuilder.DropTable(
                name: "EquipmentType");

            migrationBuilder.DropTable(
                name: "Company");

            migrationBuilder.DropTable(
                name: "AministrativeArea");

            migrationBuilder.DropTable(
                name: "InstalationType");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropIndex(
                name: "IX_AppUsers_CompanyId",
                table: "AppUsers");

            migrationBuilder.DropIndex(
                name: "IX_AppUsers_ManagementTeamId",
                table: "AppUsers");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "AppUsers");

            migrationBuilder.DropColumn(
                name: "ManagementTeamId",
                table: "AppUsers");
        }
    }
}
