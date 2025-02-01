using ElectroManage.Application.Features.Office.Query.Export.List;

namespace ElectroManage.WebAPI.Endpoint.v1.Office;
public class ExportOfficesByCompanyEndpoint : Endpoint<ExportOfficesByCompanyCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Office));
        Tags(RouteGroup.Office);
        Version(1);
        Get("/office/export");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting offices by company");
    }
    public override async Task HandleAsync(ExportOfficesByCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendBytesAsync(data, "application/pdf");
    }
}