using ElectroManage.Application.Features.Administrative_Area.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Administrative_Area;

public class DeleteAdministrativeAreaEndpoint : Endpoint<DeleteAdministrativeAreaCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.AdminstrativeArea));
        Tags(RouteGroup.AdminstrativeArea);
        Version(1);
        Delete("/administrative_area/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Delete an Administrative Area");
    }

    public async override Task HandleAsync(DeleteAdministrativeAreaCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
