using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.EquipmentBrand.Command.Delete;

public record DeleteEquipmentBrandCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
