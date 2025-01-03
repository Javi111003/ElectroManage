using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.Office.Command.Delete;

public record DeleteOfficeCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
