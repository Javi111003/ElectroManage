namespace ElectroManage.Application.DTO_s;

public record CountCreatedDeletedCompaniesByMonthDTO
{
    public int Month { get; set; }
    public int CountCreatedCompanies { get; set; }
    public int CountDeletedCompanies { get; set; }
}
