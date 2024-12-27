using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.EquipmentType.Query.Get;

public record ListEquipmentTypeResponse
{
    public ICollection<EquipmentTypeDTO> EquipmentTypes { get; set; } = [];
}
