using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.EquipmentType.Query.ListAll;

public record ListEquipmentTypeQuery : ICommand<IEnumerable<EquipmentTypeDTO>> { }
