using ElectroManage.Domain.Entites.Equipment;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.DataAccess.Configurations;
public class EquipmentSpecificationConfiguration : IEntityTypeConfiguration<EquipmentSpecification>
{
    public void Configure(EntityTypeBuilder<EquipmentSpecification> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(e => e.EquipmentBrand)
            .WithMany()
            .HasForeignKey(e => e.EquipmentBrandId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.EquipmentType)
            .WithMany()
            .HasForeignKey(e => e.EquipmentTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}