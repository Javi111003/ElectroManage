using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Roles.Query.ListAll;
public record ListRolesQuery : ICommand<IEnumerable<RoleInfoDto>>
{
}