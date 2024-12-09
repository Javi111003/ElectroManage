using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.EquipmentSpecification.Command.Delete;

public record DeleteEquipmentSpecificationCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
