namespace ElectroManage.Application.Features.EquipmentType.Command.Put;

public record EditEquipmentTypeCommand : ICommand<EditEquipmentTypeResponse>
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}