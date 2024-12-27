using ElectroManage.Application.Features.Administrative_Area.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Administrative_Area;

public class ListAdministrativeAreaEndpoint : Endpoint<EmptyRequest, ListAdministrativeAreaResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.AdminstrativeArea));
        Tags(RouteGroup.AdminstrativeArea);
        Version(1);
        Get("/administrative_area");
        AllowAnonymous();
        Summary(f => f.Summary = "List all Administrative Area");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var list = new ListAdministrativeAreaCommand();
        var data = await list.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
