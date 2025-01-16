using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.AppUser.Command.Delete;

public record DeleteUserCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}