using ElectroManage.Application.Features.Location.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.Location;

public class CreateLocationEndpoint : Endpoint<CreateLocationCommand, CreateLocationResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Location));
        Tags(RouteGroup.Location);
        Version(1);
        Post("/location");
        AllowAnonymous();
        Summary(f => f.Summary = "Creating new Location");
    }

    public async override Task HandleAsync(CreateLocationCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
