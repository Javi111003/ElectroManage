using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.EquipmentBrand.Query.ListAll;

public record ListEquipmentBrandQuery : ICommand<IEnumerable<EquipmentBrandDTO>> { }