using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Equipment;
public class EquipmentSpecification : Entity<long>
{
    public string Model { get; set; } = string.Empty;
    public decimal Capacity { get; set; }
    public bool CriticalEnergySystem { get; set; }
    public decimal AverageConsumption { get; set; }
    public int LifeSpanYears { get; set; }
    public decimal Efficiency { get; set; }
    public long EquipmentBrandId { get; set; }
    public EquipmentBrand EquipmentBrand { get; set; } = null!;
    public long EquipmentTypeId { get; set; }
    public EquipmentType EquipmentType { get; set; } = null!;
}