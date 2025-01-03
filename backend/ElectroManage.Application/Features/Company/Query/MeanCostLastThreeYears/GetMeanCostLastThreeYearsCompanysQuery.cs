namespace ElectroManage.Application.Features.Company.Query.MeanCostLastThreeYears;

public record GetMeanCostLastThreeYearsCompanysQuery : ICommand<GetMeanCostLastThreeYearsCompanysResponse>
{
    public IEnumerable<long> CompanyIds { get; set; } = new HashSet<long>();
}
