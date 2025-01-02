using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.MeanCostLastThreeYears;

public record GetMeanCostLastThreeYearsCompanysResponse
{
    public IEnumerable<ListMonthlastThreeYearsResponse> Response { get; set; } = new HashSet<ListMonthlastThreeYearsResponse>();
}
