namespace ElectroManage.Application.DTO_s;
public record CompanyResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal ConsumptionLimit { get; set; }
    public InstallationTypeDTO InstallationType { get; set; } = null!;
    public AdministrativeAreaDTO AdministrativeArea { get; set; } = null!;
    public LocationDTO Location { get; set; } = null!;
    public string Status { get; set; } = string.Empty;
    public ManagementTeamDto? ManagementTeam { get; set; }
}