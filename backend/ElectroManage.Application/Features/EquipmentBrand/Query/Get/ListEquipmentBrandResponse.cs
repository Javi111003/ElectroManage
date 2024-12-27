using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.EquipmentBrand.Query.Get;

public record ListEquipmentBrandResponse
{
    public ICollection<EquipmentBrandDTO> EquipmentBrands { get; set; } = [];
} 
