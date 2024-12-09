using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.ManagementTeam.Command.CreateTeam;
public record CreateTeamResponse
{
    public long Id { get; set; }
    public string? TeamName { get; set; } = string.Empty;
    public long CompanyId { get; set; }
    public IEnumerable<UserTeamDto> Members { get; set; } = new HashSet<UserTeamDto>();
}