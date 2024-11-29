namespace ElectroManage.Application.DTO_s;
public record YearCostDTO
{
    public int Year { get; set; }
    public decimal MeanCost { get; set; }
    public decimal MeanConsumption { get; set; }
    public MonthlyCostDTO[] MonthlyCosts { get; set; } = new MonthlyCostDTO[12];
}
