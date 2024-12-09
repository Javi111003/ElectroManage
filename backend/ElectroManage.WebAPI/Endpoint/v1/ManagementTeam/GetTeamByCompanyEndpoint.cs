using ElectroManage.Application.Features.ManagementTeam.Query.GetTeamByCompany;

namespace ElectroManage.WebAPI.Endpoint.v1.ManagementTeam;
public class GetTeamByCompanyEndpoint : Endpoint<EmptyRequest, GetTeamByCompanyResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.ManagementTeam));
        Tags(RouteGroup.ManagementTeam);
        Version(1);
        AllowAnonymous();
        Get("/company/{companyId}/team");
        Summary(f => f.Summary = "Get the management team associated with a company");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var command = new GetTeamByCompanyQuery() { CompanyId = Route<long>("companyId") };
        var data = await command.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}