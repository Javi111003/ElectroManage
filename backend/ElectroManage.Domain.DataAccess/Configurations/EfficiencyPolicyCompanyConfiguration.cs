using ElectroManage.Domain.Entites.Sucursal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElectroManage.Domain.DataAccess.Configurations;
public class EfficiencyPolicyCompanyConfiguration : IEntityTypeConfiguration<EfficiencyPolicyCompany>
{
    public void Configure(EntityTypeBuilder<EfficiencyPolicyCompany> builder)
    {
        builder.HasKey(epc => new { epc.EfficiencyPolicyId, epc.CompanyId, epc.ApplyingDate });

        builder.HasOne(epc => epc.EfficiencyPolicy)
            .WithMany(ep => ep.EfficiencyPolicyCompanies)
            .HasForeignKey(epc => epc.EfficiencyPolicyId);

        builder.HasOne(epc => epc.Company)
            .WithMany(c => c.EfficiencyPoliciesApplyed)
            .HasForeignKey(epc => epc.CompanyId);
    }
}