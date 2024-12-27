using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mappers;
public static class EquipmentBrandMapper
{
    public static EquipmentBrandDTO MapToEquipmentBrandDTO(Domain.Entites.Equipment.EquipmentBrand brand)
    {
        var response = new EquipmentBrandDTO
        {
            Id = brand.Id,
            Name = brand.Name,
            Description = brand.Description
        };
        return response;
    }
}