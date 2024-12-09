using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.ManagementTeam.Query.GetTeamByCompany;
public record GetTeamByCompanyQuery : ICommand<ManagementTeamDto>
{
    public long CompanyId { get; set; }
}