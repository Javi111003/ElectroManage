namespace ElectroManage.Application.Features.ManagementTeam.Command.UpdateTeam;
public record UpdateTeamCommand : ICommand<UpdateTeamResponse>
{
    public required long TeamId { get; set; }
    public string? Name { get; set; }
    public IEnumerable<long> UserIds { get; set; } = new HashSet<long>();
}