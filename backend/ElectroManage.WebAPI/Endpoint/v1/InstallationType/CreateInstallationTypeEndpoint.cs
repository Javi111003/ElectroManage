using ElectroManage.Application.Features.InstallationType.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.InstallationType;

public class CreateInstallationTypeEndpoint : Endpoint<CreateInstallationTypeCommand, CreateInstallationTypeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.InstallationType));
        Tags(RouteGroup.InstallationType);
        Version(1);
        Post("/installation_type");
        AllowAnonymous();
        Summary(f => f.Summary = "Creating Installation type");
    }
    public override async Task HandleAsync(CreateInstallationTypeCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
