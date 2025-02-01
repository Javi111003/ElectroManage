using ElectroManage.Application.Features.Company.Query.Export.MeanCost;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;
public class ExportMeanCostEndpoint : Endpoint<ExportMeanCostCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/export/mean_cost");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting mean cost of companies");
    }
    public override async Task HandleAsync(ExportMeanCostCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendBytesAsync(data, "application/pdf");
    }
}