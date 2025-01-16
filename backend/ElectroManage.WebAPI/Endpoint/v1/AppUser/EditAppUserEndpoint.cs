using ElectroManage.Application.Features.AppUser.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.AppUser;

public class EditAppUserEndpoint : Endpoint<EditAppUserCommand, EditAppUserResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.User));
        Tags(RouteGroup.User);
        Version(1);
        Put("/user/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit user info");
    }

    public override async Task HandleAsync(EditAppUserCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
