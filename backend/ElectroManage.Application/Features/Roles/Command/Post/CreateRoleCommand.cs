using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Roles.Command.Post;
public record CreateRoleCommand : ICommand<RoleInfoDto>
{
    public required string RoleName { get; set; }
}