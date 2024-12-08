using ElectroManage.Application.Features.InstallationType.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.InstallationType;

public class InstallationTypeGetByIdEndpoint : Endpoint<InstallationTypeGetByIdCommand, InstallationTypeGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.InstallationType));
        Tags(RouteGroup.InstallationType);
        Version(1);
        Get("/installation_type/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Get Information about an Installation Type");
    }

    public override async Task HandleAsync(InstallationTypeGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
