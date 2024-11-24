using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Office;
public class ListOfficeEndpoint : Endpoint<EmptyRequest,List<ListOfficeResponse>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Office));
        Tags(RouteGroup.Office);
        Version(1);
        Get("/office");
        AllowAnonymous();
        Summary(f => f.Summary = "List all offices");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var faker = new ListOfficeBogusConfig();
        var data = faker.Generate(20);
        await SendAsync(data, cancellation: ct);
    }
}