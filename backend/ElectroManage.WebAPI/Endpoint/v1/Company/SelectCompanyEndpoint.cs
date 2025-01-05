using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.ListSelect;

namespace ElectroManage.WebAPI.Endpoint.v1.Role;
public class SelectCompanyEndpoint : Endpoint<EmptyRequest, IEnumerable<CompanyDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/list/select");
        AllowAnonymous();
        Summary(f => f.Summary = "Listing all existent companies(without any further details)");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var query = new SelectCompanyQuery();
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}