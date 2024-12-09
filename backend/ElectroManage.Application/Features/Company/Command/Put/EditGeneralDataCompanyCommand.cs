namespace ElectroManage.Application.Features.Company.Command.Put;

public record EditGeneralDataCompanyCommand : ICommand<EditGeneralDataCompanyResponse>
{
    public long Id {  get; set; }
    public string Name { get; set; } = string.Empty;
    public long AreaId { get; set; }
    public long InstallationTypeId { get; set; }
    public long LocationId { get; set; }
    public long ManagementTeamId { get; set; }
}