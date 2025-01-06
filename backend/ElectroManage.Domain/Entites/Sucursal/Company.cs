using ElectroManage.Domain.Entites.Identity;
using ElectroManage.Domain.Entites.Offices;

namespace ElectroManage.Domain.Entites.Sucursal;
public class Company : Entity<long>
{
    public string Name { get; set; } = string.Empty;
    public decimal ConsumptionLimit { get; set; }
    public long InstalationTypeId { get; set; }
    public InstalationType InstalationType { get; set; } = null!;
    public long AministrativeAreaId { get; set; }
    public AministrativeArea AministrativeArea { get; set; } = null!;
    public long LocationId { get; set; }
    public Location Location { get; set; } = null!;
    public long? ManagementTeamId { get; set; }
    public ManagementTeam? ManagementTeam { get; set; }
    public ICollection<AppUser> Workers { get; set; } = [];
    public ICollection<Office> Offices { get; set; } = [];
    public ICollection<Warning> Warnings { get; set; } = [];
    public ICollection<Register> Registers { get; set; } = [];
    public ICollection<CostFormula> CostFormulas { get; set; } = [];
    public ICollection<EfficiencyPolicyCompany> EfficiencyPoliciesApplyed { get; set; } = [];
}