using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Company.Query.MeanCostLastThreeYears;

public record GetMeanCostLastThreeYearsCompanysResponse
{
    public ICollection<ListMonthlastThreeYearsResponse> Response { get; set; } = [];
}
