using ElectroManage.Application.Features.Company.Query.CountDeleteCompanies;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class CountDeleteCompaniesEndpoint : Endpoint<CountDeleteCompaniesCommand, CountDeleteCompaniesResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.DashBoard));
        Tags(RouteGroup.DashBoard);
        Version(1);
        Get("/companies/{year}/created_deleted");
        AllowAnonymous();
        Summary(f => f.Summary = "Count created and deleted companies by year");
    }

    public override async Task HandleAsync(CountDeleteCompaniesCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
