using ElectroManage.Application.Features.Roles.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Role;
public class DeleteRoleEndpoint : Endpoint<EmptyRequest, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Role));
        Tags(RouteGroup.Role);
        Version(1);
        Delete("/role/{roleId}");
        AllowAnonymous();
        Summary(f => f.Summary = "Removing an existant role");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var roleId = Route<long>("roleId");
        var command = new DeleteRoleCommand() { Id = roleId };
        var data = await command.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}