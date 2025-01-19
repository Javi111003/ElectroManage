namespace ElectroManage.Application.DTO_s;
public record CompanyOverLimitResponse
{
    public CompanyDTO Company {get; set;} = null!;
    public decimal Limit {get; set;}
    public decimal Consumption {get; set;}
    public decimal Exceeded {get;set;}
}