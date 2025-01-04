using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.DataAccess.Configurations;
public class AdministrativeAreaConfiguration : IEntityTypeConfiguration<AministrativeArea>
{
    public void Configure(EntityTypeBuilder<AministrativeArea> builder)
    {
        builder.HasKey(a => a.Id);
    }
}