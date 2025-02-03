using ElectroManage.Application.Features.Company.Query.Export.Proyection;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;
public class ExportProyectionEndpoint : Endpoint<ExportProyectionCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/export/proyection");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting company's proyections");
    }
    public override async Task HandleAsync(ExportProyectionCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}