namespace ElectroManage.Application.DTO_s;

public record EquipmentInstanceDTO
{
    public long Id {get;set;}
    public DateTime InstalationDate { get; set; }
    public string UseFrequency { get; set; } = string.Empty;
    public string MaintenanceStatus { get; set; } = string.Empty;
    public EquipmentSpecificationDTO EquipmentSpecification { get; set; } = null!;
    public OfficeDTO Office { get; set; } = null!;
}