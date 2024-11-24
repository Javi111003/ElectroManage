using ElectroManage.Domain.Entites.Equipment;
using ElectroManage.Domain.Entites.Identity;
using ElectroManage.Domain.Entites.Sucursal;

namespace ElectroManage.Domain.Entites.Offices;
public class Office : Entity<long>
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    public ICollection<EquipmentInstance> Equipments { get; set; } = null!;
}