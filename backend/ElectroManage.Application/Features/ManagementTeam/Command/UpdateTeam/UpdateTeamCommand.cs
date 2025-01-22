using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.ManagementTeam.Command.UpdateTeam;
public record UpdateTeamCommand : ICommand<ManagementTeamDto>
{
    public long TeamId { get; set; }
    public string? Name { get; set; }
    public IEnumerable<long> UserIds { get; set; } = new HashSet<long>();
}