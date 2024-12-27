using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.EquipmentInstance.Command.Post;
public record CreateEquipmentInstanceResponse
{
    public EquipmentInstanceDTO EquipmentInstance { get; set; } = null!;
    public DateTime Created { get; set; }

}