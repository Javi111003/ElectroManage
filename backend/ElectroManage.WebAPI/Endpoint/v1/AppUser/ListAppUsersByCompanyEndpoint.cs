using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.AppUser.Query.ListAppUsersByCompany;

namespace ElectroManage.WebAPI.Endpoint.v1.Office;
public class ListAppUsersByCompanyEndpoint : Endpoint<EmptyRequest, IEnumerable<AppUserDto>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.User));
        Tags(RouteGroup.User);
        Version(1);
        Get("/company/{companyId}/list_users");
        AllowAnonymous();
        Summary(f => f.Summary = "List all users associated to a company");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var companyId = Route<long>("companyId");
        var query = new ListAppUsersByCompanyQuery() { CompanyId = companyId };
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}