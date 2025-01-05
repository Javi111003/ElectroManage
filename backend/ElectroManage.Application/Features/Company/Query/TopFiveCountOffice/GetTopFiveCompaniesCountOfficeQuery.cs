using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.TopFiveCountOffice;
public record GetTopFiveCompaniesCountOfficeQuery : ICommand<IEnumerable<TopFiveCompanyCountOfficeDTO>>
{
}