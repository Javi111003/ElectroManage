using ElectroManage.Application.Features.Company.Query.CountDeletedCompanies;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;
public class CountDeleteCompaniesEndpoint : Endpoint<CountDeletedCompaniesQuery, CountDeletedCompaniesResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Dashboard));
        Tags(RouteGroup.Dashboard);
        Version(1);
        Get("/dashboard/count_created_deleted");
        AllowAnonymous();
        Summary(f => f.Summary = "Count created and deleted companies that specified year");
    }
    public override async Task HandleAsync(CountDeletedCompaniesQuery req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}