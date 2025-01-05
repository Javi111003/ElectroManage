using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.MeanCostLastThreeYears;

public record GetMeanCostLastThreeYearsCompanysQuery : ICommand<IEnumerable<ListMonthlastThreeYearsDto>>
{
    public IEnumerable<long> CompanyIds { get; set; } = new HashSet<long>();
}