using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.TopFiveCountWarnings;

namespace ElectroManage.WebAPI.Endpoint.v1.Dashboard;

public class GetTopFiveCompaniesCountWarningEndpoint : Endpoint<GetTopFiveCompaiesCountWarningQuery, IEnumerable<TopFiveCompaniesCountWarningDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Dashboard));
        Tags(RouteGroup.Dashboard);
        Version(1);
        Get("/dashboard/top_five/company_count_warnings/{year}");
        AllowAnonymous();
        Summary(f => f.Summary = "Get top five companies with most warnings");
    }

    public override async Task HandleAsync(GetTopFiveCompaiesCountWarningQuery req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
