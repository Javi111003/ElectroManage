using ElectroManage.Application.DTO_s;
namespace ElectroManage.Application.Features.EquipmentInstance.Query.Get;

public record EquipmentInstanceGetByIdCommand : ICommand<EquipmentInstanceDTO>
{
    public long Id { get; set; }
}
