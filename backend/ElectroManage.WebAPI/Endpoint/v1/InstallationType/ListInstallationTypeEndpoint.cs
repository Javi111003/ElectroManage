using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.InstallationType.Query.ListAll;

namespace ElectroManage.WebAPI.Endpoint.v1.InstallationType;

public class ListInstallationTypeEndpoint : Endpoint<EmptyRequest, IEnumerable<InstallationTypeDTO>>
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
        var list = new ListInstallationTypeQuery();
        var data = await list.ExecuteAsync(ct);
        await SendAsync(data);   
    }
}