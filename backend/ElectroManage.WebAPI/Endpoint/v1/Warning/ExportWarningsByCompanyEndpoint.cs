using ElectroManage.Application.Features.Warning.Query.Export.List;

namespace ElectroManage.WebAPI.Endpoint.v1.Warning;
public class ExportWarningsByCompanyEndpoint : Endpoint<ExportWarningsByCompanyCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Warning));
        Tags(RouteGroup.Warning);
        Version(1);
        Get("/warning/export");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting warnings by company");
    }
    public override async Task HandleAsync(ExportWarningsByCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendBytesAsync(data, "application/pdf");
    }
}