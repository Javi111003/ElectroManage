using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.EquipmentType.Command.Delete;

public record DeleteEquipmentTypeCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
