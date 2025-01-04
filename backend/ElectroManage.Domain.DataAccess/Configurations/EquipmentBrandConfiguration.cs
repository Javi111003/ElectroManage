using ElectroManage.Domain.Entites.Equipment;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.DataAccess.Configurations;
public class EquipmentBrandConfiguration : IEntityTypeConfiguration<EquipmentBrand>
{
    public void Configure(EntityTypeBuilder<EquipmentBrand> builder)
    {
        builder.HasKey(x => x.Id);
    }
}