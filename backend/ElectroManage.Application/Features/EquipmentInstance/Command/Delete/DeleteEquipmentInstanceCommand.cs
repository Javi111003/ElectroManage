using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.EquipmentInstance.Command.Delete;

public record DeleteEquipmentInstanceCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
