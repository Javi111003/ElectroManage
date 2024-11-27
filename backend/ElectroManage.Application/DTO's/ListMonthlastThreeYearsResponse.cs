namespace ElectroManage.Application.DTO_s;

public record ListMonthlastThreeYearsResponse
{
    public long CompanyID { get; set; }
    public ICollection<YearCostDTO> CompanyCost { get; set; } = [];
}
