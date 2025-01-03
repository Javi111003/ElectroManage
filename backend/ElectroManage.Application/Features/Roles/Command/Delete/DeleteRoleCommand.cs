using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.Roles.Command.Delete;
public record DeleteRoleCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}