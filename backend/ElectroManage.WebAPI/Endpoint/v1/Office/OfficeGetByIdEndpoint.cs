using ElectroManage.Application.Features.Office;
using ElectroManage.Application.Features.Office.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Office;

public class OfficeGetByIdEndpoint : Endpoint<OfficeGetByIdCommand, OfficeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Office));
        Tags(RouteGroup.Office);
        Version(1);
        Get("/office/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Get general data of an Office");
    }

    public override async Task HandleAsync(OfficeGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
