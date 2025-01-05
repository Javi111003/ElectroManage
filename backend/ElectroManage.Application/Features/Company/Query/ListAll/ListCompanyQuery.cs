using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ListAll;
public record ListCompanyQuery : ICommand<IEnumerable<CompanyResponse>>
{
}