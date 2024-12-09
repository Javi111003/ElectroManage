using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.ManagementTeam.Command.CreateTeam;
using ElectroManage.Application.Features.ManagementTeam.Command.UpdateTeam;
using ElectroManage.Application.Features.ManagementTeam.Query.GetTeamByCompany;

namespace ElectroManage.Application.Mappers;
public static class ManagementTeamMapper 
{
    public static CreateTeamResponse MapToCreateTeamResponse(Domain.Entites.Sucursal.ManagementTeam team)
    {
        var response = new CreateTeamResponse
        {
            Id = team.Id,
            CompanyId = team.CompanyId,
            TeamName = team.Name,
            Members = team.Members.Select(m => new UserTeamDto
            {
                UserId = m.Id,
                UserName = m.UserName ?? ""
            })
        };
        return response;
    }
    public static UpdateTeamResponse MapToUpdateTeamResponse(Domain.Entites.Sucursal.ManagementTeam team)
    {
        var response = new UpdateTeamResponse
        {
            Id = team.Id,
            CompanyId = team.CompanyId,
            TeamName = team.Name,
            Members = team.Members.Select(m => new UserTeamDto
            {
                UserId = m.Id,
                UserName = m.UserName ?? ""
            })
        };
        return response;
    }
    public static GetTeamByCompanyResponse MapToGetTeamResponse(Domain.Entites.Sucursal.ManagementTeam team)
    {
        var response = new GetTeamByCompanyResponse
        {
            Id = team.Id,
            CompanyId = team.CompanyId,
            TeamName = team.Name,
            Members = team.Members.Select(m => new UserTeamDto
            {
                UserId = m.Id,
                UserName = m.UserName ?? ""
            })
        };
        return response;
    }
}