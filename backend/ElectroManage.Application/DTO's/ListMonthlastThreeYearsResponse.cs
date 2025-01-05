namespace ElectroManage.Application.DTO_s;
public record ListMonthlastThreeYearsDto
{
    public long CompanyID { get; set; }
    public IEnumerable<YearCostDTO> YearCostDto { get; set; } = new HashSet<YearCostDTO>();
}
