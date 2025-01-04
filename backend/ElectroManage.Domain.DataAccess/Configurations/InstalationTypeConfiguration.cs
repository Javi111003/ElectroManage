using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.DataAccess.Configurations;
public class InstalationTypeConfiguration : IEntityTypeConfiguration<InstalationType>
{
    public void Configure(EntityTypeBuilder<InstalationType> builder)
    {
        builder.HasKey(x => x.Id);
    }
}