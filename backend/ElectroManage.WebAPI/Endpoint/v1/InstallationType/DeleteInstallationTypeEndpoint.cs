using ElectroManage.Application.Features.InstallationType.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.InstallationType;

public class DeleteInstallationTypeEndpoint : Endpoint<DeleteInstallationTypeCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.InstallationType));
        Tags(RouteGroup.InstallationType);
        Version(1);
        Delete("/installation_type/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Delete an Installation Type");
    }

    public override async Task HandleAsync(DeleteInstallationTypeCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
