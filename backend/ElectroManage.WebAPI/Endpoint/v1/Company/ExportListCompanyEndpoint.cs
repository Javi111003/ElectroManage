using ElectroManage.Application.Features.Company.Query.Export.List;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;
public class ExportListCompanyEndpoint : Endpoint<ExportListCompanyCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/export/list");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting companies");
    }
    public override async Task HandleAsync(ExportListCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendBytesAsync(data, "application/pdf");
    }
}