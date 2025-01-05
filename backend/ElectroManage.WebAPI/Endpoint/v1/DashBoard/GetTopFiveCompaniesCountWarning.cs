using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.TopFiveCountWarnings;

namespace ElectroManage.WebAPI.Endpoint.v1.Dashboard;

public class GetTopFiveCompaniesCountWarningEndpoint : Endpoint<EmptyRequest, IEnumerable<TopFiveCompaniesCountWarningDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.DashBoard));
        Tags(RouteGroup.DashBoard);
        Version(1);
        Get("/dashboard/top_five/company_count_warnings");
        AllowAnonymous();
        Summary(f => f.Summary = "Get top five companies with most warnings");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var topFive = new GetTopFiveCompaiesCountWarningQuery();
        var data = await topFive.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
