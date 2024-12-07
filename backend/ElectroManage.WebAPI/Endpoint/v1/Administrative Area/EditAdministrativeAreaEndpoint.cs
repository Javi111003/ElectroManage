using ElectroManage.Application.Features.Administrative_Area.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.Administrative_Area;

public class EditAdministrativeAreaEndpoint : Endpoint<EditAdministrativeAreaCommand, EditAdministrativeAreaResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.AdminstrativeArea));
        Tags(RouteGroup.AdminstrativeArea);
        Version(1);
        Put("/administrative_area/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit administrative area");
    }

    public async override Task HandleAsync(EditAdministrativeAreaCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
