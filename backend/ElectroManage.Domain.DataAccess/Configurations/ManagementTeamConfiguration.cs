using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.Configurations;
public class ManagementTeamConfiguration : IEntityTypeConfiguration<ManagementTeam>
{
    public void Configure(EntityTypeBuilder<ManagementTeam> builder)
    {
        builder.HasKey(mt => mt.Id);

        builder.HasOne(mt => mt.Company)
            .WithOne(c => c.ManagementTeam)
            .HasForeignKey<ManagementTeam>(mt => mt.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(mt => mt.Members)
            .WithOne(m => m.ManagementTeam)
            .HasForeignKey(m => m.ManagementTeamId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}