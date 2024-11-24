using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Equipment;
public class EquipmentBrand : Entity<long>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}