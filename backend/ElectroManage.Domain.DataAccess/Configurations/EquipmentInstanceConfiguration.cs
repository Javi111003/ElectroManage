using ElectroManage.Domain.Entites.Equipment;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.DataAccess.Configurations;
public class EquipmentInstanceConfiguration : IEntityTypeConfiguration<EquipmentInstance>
{
    public void Configure(EntityTypeBuilder<EquipmentInstance> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(e => e.Office)
            .WithMany(o => o.Equipments)
            .HasForeignKey(e => e.OfficeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.EquipmentSpecification)
            .WithMany()
            .HasForeignKey(e => e.EquipmentSpecificationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}