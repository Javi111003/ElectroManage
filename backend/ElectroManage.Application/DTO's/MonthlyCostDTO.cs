namespace ElectroManage.Application.DTO_s;
public record MonthlyCostDTO
{
    public int Month { get; set; }
    public decimal Cost { get; set; }
    public decimal Consumption { get; set; }
}
