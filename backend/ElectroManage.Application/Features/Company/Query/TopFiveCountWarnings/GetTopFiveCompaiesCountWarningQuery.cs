using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.TopFiveCountWarnings;
public record GetTopFiveCompaiesCountWarningQuery : ICommand<IEnumerable<TopFiveCompaniesCountWarningDTO>>
{
}