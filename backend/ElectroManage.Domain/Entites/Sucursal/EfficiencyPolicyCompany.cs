using ElectroManage.Domain.Entites.Identity;
using ElectroManage.Domain.Enums;

namespace ElectroManage.Domain.Entites.Sucursal;
public class EfficiencyPolicyCompany : IEntity
{
    public long EfficiencyPolicyId { get; set; }
    public EfficiencyPolicy EfficiencyPolicy { get; set; } = null!;
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    public DateTime ApplyingDate { get; set; } = DateTime.UtcNow;
    public DateTime? To { get; set; }
    public DateTime Created { get; set; }
    public DateTime? LastModified { get; set; }
    public StatusEntityType StatusBaseEntity { get; set; } = StatusEntityType.Active;
}