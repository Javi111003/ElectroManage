using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ListCompanyOverLimit;

public record ListCompanyOverLimitQuery : ICommand<IEnumerable<CompanyOverLimitResponse>>
{
    public DateTime Date {get; set;}
}