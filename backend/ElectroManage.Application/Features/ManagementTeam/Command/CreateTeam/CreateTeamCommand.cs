using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.ManagementTeam.Command.CreateTeam;
public record CreateTeamCommand : ICommand<ManagementTeamDto>
{
    public string? Name { get; set; }
    public long CompanyId { get; set; }
    public IEnumerable<long> UserIds { get; set; } = new HashSet<long>(); 
}