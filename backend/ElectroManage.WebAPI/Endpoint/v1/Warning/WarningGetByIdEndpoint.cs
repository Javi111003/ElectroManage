using ElectroManage.Application.Features.Warning.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Warning;

public class WarningGetByIdEndpoint : Endpoint<WarningGetByIdCommand,  WarningGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Warning));
        Tags(RouteGroup.Warning);
        Version(1);
        Get("/warning/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Getting information about a warning");
    }

    public override async Task HandleAsync(WarningGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
