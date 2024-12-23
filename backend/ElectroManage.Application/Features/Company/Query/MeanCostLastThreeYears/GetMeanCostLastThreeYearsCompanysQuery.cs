namespace ElectroManage.Application.Features.Company.Query.MeanCostLastThreeYears;

public record GetMeanCostLastThreeYearsCompanysQuery : ICommand<GetMeanCostLastThreeYearsCompanysResponse>
{
    public ICollection<long> CompanyIds { get; set; } = [];
}
