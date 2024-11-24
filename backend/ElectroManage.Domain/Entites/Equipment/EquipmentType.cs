using ElectroManage.Domain.Entites.Identity;

namespace ElectroManage.Domain.Entites.Equipment;
public class EquipmentType : Entity<long>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}