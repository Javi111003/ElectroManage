using ElectroManage.Application.Features.Company.Query.TopFiveCountOffice;

namespace ElectroManage.WebAPI.Endpoint.v1.DashBoard;

public class GetTopFiveCompanyCountOfficesEndpoint : Endpoint<EmptyRequest, GetTopFiveCompaniesCountOfficeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.DashBoard));
        Tags(RouteGroup.DashBoard);
        Version(1);
        Get("/dash_board/top_five/company_count_offices");
        AllowAnonymous();
        Summary(f => f.Summary = "Get top five companies with most offices");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var topFive = new GetTopFiveCompaniesCountOfficeCommand();
        var data = await topFive.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
