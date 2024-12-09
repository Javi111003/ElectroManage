using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.Warning.Command.Delete;

public record DeleteWarningCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }    
}
