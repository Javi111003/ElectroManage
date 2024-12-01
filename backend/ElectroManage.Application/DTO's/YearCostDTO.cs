namespace ElectroManage.Application.DTO_s;
public record YearCostDTO
{
    public int Year { get; set; }
    public decimal MeanMonthlyCost { get; set; }
    public decimal MeanMonthlyConsumption { get; set; }
}