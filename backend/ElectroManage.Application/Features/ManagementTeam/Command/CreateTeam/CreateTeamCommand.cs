namespace ElectroManage.Application.Features.ManagementTeam.Command.CreateTeam;
public record CreateTeamCommand : ICommand<CreateTeamResponse>
{
    public string? Name { get; set; }
    public required long CompanyId { get; set; }
    public IEnumerable<long> UserIds { get; set; } = new HashSet<long>(); 
}