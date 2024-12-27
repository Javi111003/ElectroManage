using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.EquipmentInstance.Command.Put;

public record EditEquipmentInstanceCommand : ICommand<EquipmentInstanceDTO>
{
    public long Id { get; set; }
    public DateTime InstalationDate { get; set; }
    public string MaintenanceStatus { get; set; } = string.Empty;
    public string UseFrequency { get; set; } = string.Empty;
    public long EquipmentSpecificationId { get; set; }
    public long OfficeId { get; set; }
}