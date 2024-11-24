using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.Configurations;
public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasOne(c => c.InstalationType)
            .WithMany()
            .HasForeignKey(c => c.InstalationTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.AministrativeArea)
            .WithMany()
            .HasForeignKey(c => c.AministrativeAreaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Location)
            .WithMany()
            .HasForeignKey(c => c.LocationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.ManagementTeam)
            .WithOne(m => m.Company)
            .HasForeignKey<Company>(c => c.ManagementTeamId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Workers)
            .WithOne(w => w.Company)
            .HasForeignKey(w => w.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Offices)
            .WithOne(o => o.Company)
            .HasForeignKey(o => o.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.ConsumptionLimits)
            .WithMany(l => l.Companies);

        builder.HasMany(c => c.Warnings)
            .WithOne(w => w.Company)
            .HasForeignKey(w => w.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Registers)
            .WithOne(r => r.Company)
            .HasForeignKey(r => r.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.CostFormulas)
            .WithOne(cf => cf.Company)
            .HasForeignKey(cf => cf.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.EfficiencyPolicies)
            .WithMany(ep => ep.Companies);
    }
}