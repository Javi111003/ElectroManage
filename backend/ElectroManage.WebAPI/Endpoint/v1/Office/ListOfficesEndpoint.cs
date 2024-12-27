using ElectroManage.Application.Features.Office.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Office;

public class ListOfficesEndpoint : Endpoint<EmptyRequest, ListOfficeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Office));
        Tags(RouteGroup.Office);
        Version(1);
        Get("/office");
        AllowAnonymous();
        Summary(f => f.Summary = "List all offices in the system");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var list = new ListOfficeCommand();
        var data = await list.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
