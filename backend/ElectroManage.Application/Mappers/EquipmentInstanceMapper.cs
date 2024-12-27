using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.EquipmentInstance.Query.Get;
using ElectroManage.Domain.Enums.Equipment;

namespace ElectroManage.Application.Mappers;
public static class EquipmentInstanceMapper
{
    public static EquipmentInstanceDTO MapToEquipmentInstanceDTO(Domain.Entites.Equipment.EquipmentInstance equipmentInstance)
    {    
        return new EquipmentInstanceDTO
        {
            Id = equipmentInstance.Id,
            InstalationDate = equipmentInstance.InstalationDate,
            UseFrequency = equipmentInstance.UseFrequency.ToString(),
            MaintenanceStatus = equipmentInstance.MantainceStatus.ToString(),
            EquipmentSpecification = EquipmentSpecificationMapper.MapToEquipmentSpecificationDTO(equipmentInstance.EquipmentSpecification),
            Office = OfficeMapper.MapToOfficeDTO(equipmentInstance.Office)
            };
    }
}