namespace ElectroManage.Application.DTO_s;
public record DailyCostByCompanyDto
{
    public long RegisterId { get; set; }
    public long CompanyId { get; set; }
    public decimal Consumption { get; set; }
    public decimal Cost { get; set; }
    public DateTime RegisterDate { get; set; }
}