using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.DataAccess.Configurations;
public class CostFormulaConfiguration : IEntityTypeConfiguration<CostFormula>
{
    public void Configure(EntityTypeBuilder<CostFormula> builder)
    {
        builder.HasKey(c => c.Id);

        builder.HasOne(c => c.Company)
            .WithMany(c => c.CostFormulas)
            .HasForeignKey(c => c.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.VariableDefinitions)
            .WithOne(c => c.Formula)
            .HasForeignKey(c => c.FormulaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}