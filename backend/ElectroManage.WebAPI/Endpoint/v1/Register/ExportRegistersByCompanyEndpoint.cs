using ElectroManage.Application.Features.Register.Query.Export.List;

namespace ElectroManage.WebAPI.Endpoint.v1.Register;
public class ExportRegistersByCompanyEndpoint : Endpoint<ExportRegistersByCompanyCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Register));
        Tags(RouteGroup.Register);
        Version(1);
        Get("/register/export");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting registers by company");
    }
    public override async Task HandleAsync(ExportRegistersByCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendBytesAsync(data, "application/pdf");
    }
}