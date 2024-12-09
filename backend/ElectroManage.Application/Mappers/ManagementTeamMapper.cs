using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mappers;
public static class ManagementTeamMapper
{
    public static ManagementTeamDto MapToManagementTeamDto(Domain.Entites.Sucursal.ManagementTeam team)
    {
        var response = new ManagementTeamDto
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