using ElectroManage.Application.Features.Administrative_Area.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.Administrative_Area;

public class CreateAdministrativeAreaEndpoint : Endpoint<CreateAdministrativeAreaCommand, CreateAdministrativeAreaResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.AdminstrativeArea));
        Tags(RouteGroup.AdminstrativeArea);
        Version(1);
        Post("/administrative_area");
        AllowAnonymous();
        Summary(f => f.Summary = "Create a new Administrative Area");
    }

    public async override Task HandleAsync(CreateAdministrativeAreaCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
