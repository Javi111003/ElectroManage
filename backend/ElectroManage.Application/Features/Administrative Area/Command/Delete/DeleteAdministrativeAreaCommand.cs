using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.Administrative_Area.Command.Delete;

public record DeleteAdministrativeAreaCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
