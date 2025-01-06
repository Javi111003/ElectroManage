namespace ElectroManage.Domain.Entites.Sucursal;
public class EfficiencyPolicyCompany
{
    public long EfficiencyPolicyId { get; set; }
    public EfficiencyPolicy EfficiencyPolicy { get; set; } = null!;
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    public DateTime ApplyingDate { get; set; } = DateTime.UtcNow;
    public DateTime? To { get; set; }
}