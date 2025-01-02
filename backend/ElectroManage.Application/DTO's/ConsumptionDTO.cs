namespace ElectroManage.Application.DTO_s;

public record ConsumptionDTO
{
    public long CompanyId { get; set; }
    public decimal TotalConsumption { get; set; }
}
