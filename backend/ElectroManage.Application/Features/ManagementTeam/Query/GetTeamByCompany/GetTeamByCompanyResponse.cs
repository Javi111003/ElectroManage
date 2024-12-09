using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.ManagementTeam.Query.GetTeamByCompany;
public record GetTeamByCompanyResponse
{
    public long Id { get; set; }
    public string? TeamName { get; set; }
    public long CompanyId { get; set; }
    public IEnumerable<UserTeamDto> Members { get; set; }
}