using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mappers;
public static class EquipmentSpecificationMapper
{
    public static EquipmentSpecificationDTO MapToEquipmentSpecificationDTO(Domain.Entites.Equipment.EquipmentSpecification equipmentSpecification )
    {
        var response = new EquipmentSpecificationDTO
        {
            Id = equipmentSpecification.Id,
            Model = equipmentSpecification.Model,
            Capacity = equipmentSpecification.Capacity,
            CriticalEnergySystem = equipmentSpecification.CriticalEnergySystem,
            AverageConsumption = equipmentSpecification.AverageConsumption,
            LifeSpanYears = equipmentSpecification.LifeSpanYears,
            Efficiency = equipmentSpecification.Efficiency,
            EquipmentBrand = EquipmentBrandMapper.MapToEquipmentBrandDTO(equipmentSpecification.EquipmentBrand),
            EquipmentType = EquipmentTypeMapper.MapToEquipmentTypeDTO(equipmentSpecification.EquipmentType)
            
        };
        return response;
    }
}