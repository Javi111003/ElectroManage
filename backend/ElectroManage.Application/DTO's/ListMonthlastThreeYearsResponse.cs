namespace ElectroManage.Application.DTO_s;
public record ListMonthlastThreeYearsResponse
{
    public long CompanyID { get; set; }
    public IEnumerable<YearCostDTO> YearCostDto { get; set; } = new HashSet<YearCostDTO>();
}
