namespace ElectroManage.Application.Features.EquipmentType.Query.Get;

public record EquipmentTypeGetByIdResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description {get;set;}
    public DateTime Created { get; set; }
    public string Status { get; set; } = string.Empty;
}
