using ElectroManage.Application.Features.Warning.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.Warning;

public class CreateWarningEndpoint : Endpoint<CreateWarningCommand, CreateWarningResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Warning));
        Tags(RouteGroup.Warning);
        Version(1);
        Post("/warning");
        AllowAnonymous();
        Summary(f => f.Summary = "Create a new warning");
    }

    public override async Task HandleAsync(CreateWarningCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
