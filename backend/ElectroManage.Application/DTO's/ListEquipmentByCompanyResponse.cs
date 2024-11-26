
namespace ElectroManage.Application.DTO_s;

public record ListEquipmentByCompanyResponse
{
    public long CompanyId { get; set; } = 1;
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string UseFrequency { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public decimal Efficency { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string EquipmentType { get; set; } = string.Empty;
}
