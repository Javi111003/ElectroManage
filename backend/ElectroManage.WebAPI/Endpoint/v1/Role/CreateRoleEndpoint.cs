using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Roles.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.Role;
public class CreateRoleEndpoint : Endpoint<CreateRoleCommand, RoleInfoDto>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Role));
        Tags(RouteGroup.Role);
        Version(1);
        Post("/role");
        AllowAnonymous();
        Summary(f => f.Summary = "Creating a new Role");
    }
    public override async Task HandleAsync(CreateRoleCommand command, CancellationToken ct)
    {
        var data = await command.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}