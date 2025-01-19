namespace ElectroManage.Application.DTO_s;
public record YearCostDTO
{
    public int Year { get; set; }
    public double MeanCost { get; set; }
    public double MeanConsumption { get; set; }
}