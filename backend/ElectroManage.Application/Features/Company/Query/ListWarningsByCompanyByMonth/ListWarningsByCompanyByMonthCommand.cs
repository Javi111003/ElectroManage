using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ListWarningsByCompanyByMonth;

public record ListWarningsByCompanyByMonthCommand : ICommand<IEnumerable<CountWarningByMonthDTO>>
{
    public long CompanyId { get; set; }
    public long? Year { get; set; }
}
