using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.Register.Command.Delete;

public record DeleteRegisterCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
