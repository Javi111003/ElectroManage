namespace ElectroManage.Application.DTO_s;
public record YearCostDTO
{
    public int Year { get; set; }
    public decimal MeanCost { get; set; }
    public decimal MeanConsumption { get; set; }
}