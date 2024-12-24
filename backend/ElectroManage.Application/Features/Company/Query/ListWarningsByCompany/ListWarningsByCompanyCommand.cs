using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ListWarningsByCompany;

public record ListWarningsByCompanyCommand : ICommand<ListWarningsByCompanyResponse>
{
    public long CompanyId { get; set; }
}
