namespace ElectroManage.Application.Features.EquipmentBrand.Command.Put;

public record EditEquipmentBrandCommand : ICommand<EditEquipmentBrandResponse>
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}