namespace ElectroManage.Application.Features.EquipmentBrand.Query.Get;

public record EquipmentBrandGetByIdResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description {get;set;}
    public DateTime Created { get; set; }
    public string Status { get; set; } = string.Empty;
}
