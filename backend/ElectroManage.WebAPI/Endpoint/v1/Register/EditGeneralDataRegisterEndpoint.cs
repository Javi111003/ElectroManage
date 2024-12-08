using ElectroManage.Application.Features.Register.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.Register;

public class EditGeneralDataRegisterEndpoint : Endpoint<EditGeneralDataRegisterCommand, EditGeneralDataRegisterResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Register));
        Tags(RouteGroup.Register);
        Version(1);
        Put("/register/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit general data of a register");
    }

    public override async Task HandleAsync(EditGeneralDataRegisterCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
