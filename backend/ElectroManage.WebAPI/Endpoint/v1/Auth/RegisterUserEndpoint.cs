using ElectroManage.Common.Dtos;
using ElectroManage.WebAPI.Models;

namespace ElectroManage.WebAPI.Endpoint.v1.Auth;

public class RegisterUserEndpoint : Endpoint<RegisterModel, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Auth));
        Tags(RouteGroup.Auth);
        Version(1);
        AllowAnonymous();
        Post("/register/user");
        Summary(f => f.Summary = "Register an user");
    }
    public override async Task HandleAsync(RegisterModel command, CancellationToken ct)
    {
        var data = await command.ExecuteAsync(ct);
        await SendAsync(data,cancellation: ct);
    }
}