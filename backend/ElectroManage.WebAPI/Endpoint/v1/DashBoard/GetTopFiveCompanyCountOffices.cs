using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.TopFiveCountOffice;

namespace ElectroManage.WebAPI.Endpoint.v1.Dashboard;

public class GetTopFiveCompanyCountOfficesEndpoint : Endpoint<EmptyRequest, IEnumerable<TopFiveCompanyCountOfficeDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.DashBoard));
        Tags(RouteGroup.DashBoard);
        Version(1);
        Get("/dashboard/top_five/company_count_offices");
        AllowAnonymous();
        Summary(f => f.Summary = "Get top five companies with most offices");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var topFiveQuery = new GetTopFiveCompaniesCountOfficeQuery();
        var data = await topFiveQuery.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
