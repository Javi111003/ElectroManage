using ElectroManage.Application.Features.Register.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Register;

public class RegisterGetByIdEndpoint : Endpoint<RegisterGetByIdCommand,  RegisterGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Register));
        Tags(RouteGroup.Register);
        Version(1);
        Get("/register/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Get general data of a Register");
    }

    public override async Task HandleAsync(RegisterGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
