using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Command.Post;

public record CreateCompanyResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string InstallationType {  get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public ManagementTeamDto? ManagementTeam { get; set; }
}