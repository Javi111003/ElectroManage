using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Command.Put;

public record EditGeneralDataCompanyResponse
{
    public string Name { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Installation {  get; set; } = string.Empty;
    public string LocationDetails {  get; set; } = string.Empty;
    public ManagementTeamDto? ManagementTeam { get; set; }
}