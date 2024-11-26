namespace ElectroManage.Application.DTO_s;
public record ListEquipmentByOfficeResponse
{
    public long Id { get; set; }
    public long OfficeId { get; set; }
    public long CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string UseFrequency { get; set; } = string.Empty;
    public string MaintenanceStatus { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public decimal Efficency { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string EquipmentType { get; set; } = string.Empty;
}