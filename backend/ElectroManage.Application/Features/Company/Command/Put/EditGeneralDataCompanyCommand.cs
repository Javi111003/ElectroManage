using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Command.Put;

public record EditGeneralDataCompanyCommand : ICommand<CompanyResponse>
{
    public long Id {  get; set; }
    public string Name { get; set; } = string.Empty;
    public long AreaId { get; set; }
    public long InstallationTypeId { get; set; }
    public long LocationId { get; set; }
    public long ManagementTeamId { get; set; }
    public long EfficiencyPolicyId { get; set; }
    public decimal ConsumptionLimit { get; set; }
}