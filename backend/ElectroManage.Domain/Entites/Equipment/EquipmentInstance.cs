using ElectroManage.Domain.Entites.Identity;
using ElectroManage.Domain.Entites.Offices;
using ElectroManage.Domain.Enums.Equipment;

namespace ElectroManage.Domain.Entites.Equipment;
public class EquipmentInstance : Entity<long>
{
    public DateTime InstalationDate { get; set; }
    public MaintenanceStatus MantainceStatus { get; set; }
    public UseFrequency UseFrequency { get; set; }
    public long EquipmentSpecificationId { get; set; }
    public EquipmentSpecification EquipmentSpecification { get; set; } = null!;
    public long OfficeId { get; set; }
    public Office Office { get; set; } = null!;
}