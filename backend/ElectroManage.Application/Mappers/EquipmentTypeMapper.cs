using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mappers;
public static class EquipmentTypeMapper
{
    public static EquipmentTypeDTO MapToEquipmentTypeDTO(Domain.Entites.Equipment.EquipmentType type)
    {
        var response = new EquipmentTypeDTO
        {
            Id = type.Id,
            Name = type.Name,
            Description = type.Description
        };
        return response;
    }
}