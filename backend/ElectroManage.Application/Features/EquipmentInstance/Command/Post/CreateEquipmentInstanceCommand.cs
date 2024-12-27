namespace ElectroManage.Application.Features.EquipmentInstance.Command.Post;
public record CreateEquipmentInstanceCommand : ICommand<CreateEquipmentInstanceResponse>
{
    public DateTime InstalationDate { get; set; }
    public string MaintenanceStatus { get; set; } = string.Empty;
    public string UseFrequency { get; set; } = string.Empty;
    public required long EquipmentSpecificationId { get; set; }
    public required long OfficeId { get; set; }
}