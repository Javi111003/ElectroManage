namespace ElectroManage.Application.Features.ManagementTeam.Query.GetTeamByCompany;
public record GetTeamByCompanyQuery : ICommand<GetTeamByCompanyResponse>
{
    public long CompanyId { get; set; }
}