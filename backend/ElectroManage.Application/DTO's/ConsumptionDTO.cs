namespace ElectroManage.Application.DTO_s;

public record ConsumptionDTO
{
    public long CompanyId { get; set; }
    public string CompanyName { get; set; } = null!;
    public decimal ConsumptionLimit { get; set; }
    public double TotalConsumption { get; set; }
}