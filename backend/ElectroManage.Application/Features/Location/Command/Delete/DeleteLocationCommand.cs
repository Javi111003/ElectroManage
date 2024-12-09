using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.Location.Command.Delete;

public record DeleteLocationCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
