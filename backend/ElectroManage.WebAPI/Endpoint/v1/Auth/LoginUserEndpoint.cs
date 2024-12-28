using ElectroManage.Application.Features.Auth.Login;
using ElectroManage.WebAPI.Models;

namespace ElectroManage.WebAPI.Endpoint.v1.Auth;
public class LoginUserEndpoint : Endpoint<LoginModel, LoginUserResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Auth));
        Tags(RouteGroup.Auth);
        Version(1);
        AllowAnonymous();
        Post("/login");
        Summary(f => f.Summary = "Login as user");
    }
    public override async Task HandleAsync(LoginModel command, CancellationToken ct)
    {
        var data = await command.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}