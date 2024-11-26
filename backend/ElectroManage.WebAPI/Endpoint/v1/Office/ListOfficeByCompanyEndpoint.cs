using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Office;
public class ListOfficeByCompanyEndpoint : Endpoint<EmptyRequest,List<ListOfficeResponse>>
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
        var faker = new ListOfficeByCompanyBogusConfig();
        var data = faker.Generate(20);
        data.ForEach(d => d.CompanyId = companyId);
        await SendAsync(data, cancellation: ct);
    }
}