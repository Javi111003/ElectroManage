using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.ListSelect;
public record SelectCompanyQuery : ICommand<IEnumerable<CompanyDTO>>
{
}