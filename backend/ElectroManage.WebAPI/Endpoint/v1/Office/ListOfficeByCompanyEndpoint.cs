using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Office.Query.ListAll;

namespace ElectroManage.WebAPI.Endpoint.v1.Office;
public class ListOfficeByCompanyEndpoint : Endpoint<EmptyRequest, IEnumerable<OfficeDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Office));
        Tags(RouteGroup.Office);
        Version(1);
        Get("/company/{companyId}/office");
        AllowAnonymous();
        Summary(f => f.Summary = "List all offices associated to a company");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var companyId = Route<long>("companyId");
        var query = new ListOfficeByCompanyQuery() { CompanyId = companyId };
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}