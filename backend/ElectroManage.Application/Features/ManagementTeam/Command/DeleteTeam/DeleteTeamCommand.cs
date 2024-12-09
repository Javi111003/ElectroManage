namespace ElectroManage.Application.Features.ManagementTeam.Command.DeleteTeam;
public record DeleteTeamCommand : ICommand<DeleteTeamResponse>
{
    public required long TeamId { get; set; }
    public required long CompanyId { get; set; }
}
