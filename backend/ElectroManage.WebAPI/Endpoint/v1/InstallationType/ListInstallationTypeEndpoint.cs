using ElectroManage.Application.Features.InstallationType.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.InstallationType;

public class ListInstallationTypeEndpoint : Endpoint<EmptyRequest, ListInstallationTypeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.InstallationType));
        Tags(RouteGroup.InstallationType);
        Version(1);
        Get("/installation_type");
        AllowAnonymous();
        Summary(f => f.Summary = "List installation types");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var list = new ListInstallationTypeCommand();
        var data = await list.ExecuteAsync(ct);
        await SendAsync(data);   
    }
}
