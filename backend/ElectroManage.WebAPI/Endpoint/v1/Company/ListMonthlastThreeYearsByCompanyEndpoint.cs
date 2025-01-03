using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.MeanCostLastThreeYears;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class ListMonthlastThreeYearsByCompanyEndpoint : Endpoint<GetMeanCostLastThreeYearsCompanysQuery, GetMeanCostLastThreeYearsCompanysResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/mean_cost_last_three_years");
        AllowAnonymous();
        Summary(f => f.Summary = "List mean cost and mean consumption during the last three years for companies");
    }

    public override async Task HandleAsync(GetMeanCostLastThreeYearsCompanysQuery req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}