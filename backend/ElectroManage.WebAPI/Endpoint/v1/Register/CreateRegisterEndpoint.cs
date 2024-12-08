using ElectroManage.Application.Features.Register.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.Register;

public class CreateRegisterEndpoint : Endpoint<CreateRegisterCommand, CreateRegisterResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Register));
        Tags(RouteGroup.Register);
        Version(1);
        Post("/register");
        AllowAnonymous();
        Summary(f => f.Summary = "Create new Register for a Company");
    }

    public override async Task HandleAsync(CreateRegisterCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
