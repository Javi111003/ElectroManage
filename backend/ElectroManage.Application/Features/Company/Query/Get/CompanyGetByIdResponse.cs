using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.Get;

public record CompanyGetByIdResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public InstallationTypeDTO InstallationType { get; set; } = null!;
    public AdministrativeAreaDTO AdministrativeArea { get; set; } = null!;
    public LocationDTO Location { get; set; } = null!;
    public string Status { get; set; } = string.Empty;
    public ManagementTeamDto ManagementTeam { get; set; } = null!;
}