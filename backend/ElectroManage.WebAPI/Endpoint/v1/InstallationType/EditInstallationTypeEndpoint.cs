using ElectroManage.Application.Features.InstallationType.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.InstallationType;

public class EditInstallationTypeEndpoint : Endpoint<EditInstallationTypeCommand, EditInstallationTypeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.InstallationType));
        Tags(RouteGroup.InstallationType);
        Version(1);
        Put("/installation_type/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit an Installation Type");
    }

    public override async Task HandleAsync(EditInstallationTypeCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
