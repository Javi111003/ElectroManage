using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Command.Post;

public record CreateCompanyCommand : ICommand<CompanyResponse>
{
    public string Name { get; set; } = string.Empty;
    public long AreaId { get; set; }
    public long InstallationTypeId { get; set; }
    public long LocationId { get; set; }
    public long ManagementTeamId { get; set; }
    public long EfficiencyPolicyId { get; set; }
    public DateTime PolicyApplyingDate {get; set; }
    public decimal ConsumptionLimit { get; set; }
}