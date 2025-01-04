﻿// <auto-generated />
using System;
using ElectroManage.Domain.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ElectroManage.Domain.DataAccess.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250104195912_AllConfigsAdded")]
    partial class AllConfigsAdded
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("CompanyEfficiencyPolicy", b =>
                {
                    b.Property<long>("CompaniesId")
                        .HasColumnType("bigint");

                    b.Property<long>("EfficiencyPoliciesId")
                        .HasColumnType("bigint");

                    b.HasKey("CompaniesId", "EfficiencyPoliciesId");

                    b.HasIndex("EfficiencyPoliciesId");

                    b.ToTable("CompanyEfficiencyPolicy");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Equipment.EquipmentBrand", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("EquipmentBrand");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Equipment.EquipmentInstance", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<long>("EquipmentSpecificationId")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("InstalationDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("MantainceStatus")
                        .HasColumnType("integer");

                    b.Property<long>("OfficeId")
                        .HasColumnType("bigint");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.Property<int>("UseFrequency")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("EquipmentSpecificationId");

                    b.HasIndex("OfficeId");

                    b.ToTable("EquipmentInstance");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Equipment.EquipmentSpecification", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<decimal>("AverageConsumption")
                        .HasColumnType("numeric");

                    b.Property<decimal>("Capacity")
                        .HasColumnType("numeric");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<bool>("CriticalEnergySystem")
                        .HasColumnType("boolean");

                    b.Property<decimal>("Efficiency")
                        .HasColumnType("numeric");

                    b.Property<long>("EquipmentBrandId")
                        .HasColumnType("bigint");

                    b.Property<long>("EquipmentTypeId")
                        .HasColumnType("bigint");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("LifeSpanYears")
                        .HasColumnType("integer");

                    b.Property<string>("Model")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("EquipmentBrandId");

                    b.HasIndex("EquipmentTypeId");

                    b.ToTable("EquipmentSpecification");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Equipment.EquipmentType", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("EquipmentType");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Identity.AppRole", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<bool>("IsLock")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AppRoles", (string)null);
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Identity.AppUser", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<long>("CompanyId")
                        .HasColumnType("bigint");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<long?>("ManagementTeamId")
                        .HasColumnType("bigint");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("ManagementTeamId");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AppUsers", (string)null);
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Location", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("AddressDetails")
                        .HasColumnType("text");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<double>("Latitude")
                        .HasColumnType("double precision");

                    b.Property<double>("Longitude")
                        .HasColumnType("double precision");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("Location");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Offices.Office", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("CompanyId")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("Office");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.AministrativeArea", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("AministrativeArea");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.Company", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("AministrativeAreaId")
                        .HasColumnType("bigint");

                    b.Property<decimal>("ConsumptionLimit")
                        .HasColumnType("numeric");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<long>("InstalationTypeId")
                        .HasColumnType("bigint");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<long>("LocationId")
                        .HasColumnType("bigint");

                    b.Property<long?>("ManagementTeamId")
                        .HasColumnType("bigint");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("AministrativeAreaId");

                    b.HasIndex("InstalationTypeId");

                    b.HasIndex("LocationId");

                    b.ToTable("Company");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.CostFormula", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("ApplyingDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<long>("CompanyId")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<decimal>("ExtraPerCent")
                        .HasColumnType("numeric");

                    b.Property<long>("Increase")
                        .HasColumnType("bigint");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("CostFormula");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.EfficiencyPolicy", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("ApplyingDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("EfficiencyPolicy");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.InstalationType", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("InstalationType");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.ManagementTeam", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("CompanyId")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId")
                        .IsUnique();

                    b.ToTable("ManagementTeam");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.Register", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("CompanyId")
                        .HasColumnType("bigint");

                    b.Property<decimal>("Consumption")
                        .HasColumnType("numeric");

                    b.Property<decimal>("Cost")
                        .HasColumnType("numeric");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("Register");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.Warning", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("CompanyId")
                        .HasColumnType("bigint");

                    b.Property<decimal>("Consumption")
                        .HasColumnType("numeric");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<decimal>("EstablishedLimit")
                        .HasColumnType("numeric");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("StatusBaseEntity")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("Warning");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<long>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<long>("RoleId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<long>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<long>("UserId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<long>", b =>
                {
                    b.Property<long>("UserId")
                        .HasColumnType("bigint");

                    b.Property<long>("RoleId")
                        .HasColumnType("bigint");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AppUserRole", (string)null);
                });

            modelBuilder.Entity("CompanyEfficiencyPolicy", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.Company", null)
                        .WithMany()
                        .HasForeignKey("CompaniesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.EfficiencyPolicy", null)
                        .WithMany()
                        .HasForeignKey("EfficiencyPoliciesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Equipment.EquipmentInstance", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Equipment.EquipmentSpecification", "EquipmentSpecification")
                        .WithMany()
                        .HasForeignKey("EquipmentSpecificationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ElectroManage.Domain.Entites.Offices.Office", "Office")
                        .WithMany("Equipments")
                        .HasForeignKey("OfficeId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("EquipmentSpecification");

                    b.Navigation("Office");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Equipment.EquipmentSpecification", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Equipment.EquipmentBrand", "EquipmentBrand")
                        .WithMany()
                        .HasForeignKey("EquipmentBrandId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ElectroManage.Domain.Entites.Equipment.EquipmentType", "EquipmentType")
                        .WithMany()
                        .HasForeignKey("EquipmentTypeId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("EquipmentBrand");

                    b.Navigation("EquipmentType");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Identity.AppUser", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.Company", "Company")
                        .WithMany("Workers")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.ManagementTeam", "ManagementTeam")
                        .WithMany("Members")
                        .HasForeignKey("ManagementTeamId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Company");

                    b.Navigation("ManagementTeam");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Offices.Office", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.Company", "Company")
                        .WithMany("Offices")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Company");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.Company", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.AministrativeArea", "AministrativeArea")
                        .WithMany()
                        .HasForeignKey("AministrativeAreaId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.InstalationType", "InstalationType")
                        .WithMany()
                        .HasForeignKey("InstalationTypeId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ElectroManage.Domain.Entites.Location", "Location")
                        .WithMany()
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("AministrativeArea");

                    b.Navigation("InstalationType");

                    b.Navigation("Location");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.CostFormula", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.Company", "Company")
                        .WithMany("CostFormulas")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Company");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.ManagementTeam", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.Company", "Company")
                        .WithOne("ManagementTeam")
                        .HasForeignKey("ElectroManage.Domain.Entites.Sucursal.ManagementTeam", "CompanyId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Company");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.Register", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.Company", "Company")
                        .WithMany("Registers")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Company");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.Warning", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Sucursal.Company", "Company")
                        .WithMany("Warnings")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Company");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<long>", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Identity.AppRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<long>", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Identity.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<long>", b =>
                {
                    b.HasOne("ElectroManage.Domain.Entites.Identity.AppRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ElectroManage.Domain.Entites.Identity.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Offices.Office", b =>
                {
                    b.Navigation("Equipments");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.Company", b =>
                {
                    b.Navigation("CostFormulas");

                    b.Navigation("ManagementTeam");

                    b.Navigation("Offices");

                    b.Navigation("Registers");

                    b.Navigation("Warnings");

                    b.Navigation("Workers");
                });

            modelBuilder.Entity("ElectroManage.Domain.Entites.Sucursal.ManagementTeam", b =>
                {
                    b.Navigation("Members");
                });
#pragma warning restore 612, 618
        }
    }
}
