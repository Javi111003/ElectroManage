using ElectroManage.Domain.Entites.Offices;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.DataAccess.Configurations;
public class OfficeConfiguration : IEntityTypeConfiguration<Office>
{
    public void Configure(EntityTypeBuilder<Office> builder)
    {
        builder.HasKey(o => o.Id);

        builder.HasOne(o => o.Company)
            .WithMany(c => c.Offices)
            .HasForeignKey(o => o.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.Equipments)
            .WithOne(e => e.Office)
            .HasForeignKey(e => e.OfficeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}