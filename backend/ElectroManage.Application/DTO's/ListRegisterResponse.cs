namespace ElectroManage.Application.DTO_s;
public class ListRegisterResponse
{
    public decimal TotalConsumption { get; set; }
    public decimal TotalCost { get; set; }
    public IEnumerable<DailyCostByCompanyDto> Registers { get; set; } = new HashSet<DailyCostByCompanyDto>();
}