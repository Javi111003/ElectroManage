using ElectroManage.Application.Features.Efficiency_Policy.Query.Export.List;

namespace ElectroManage.WebAPI.Endpoint.v1.Policy;
public class ExportPoliciesByCompanyEndpoint : Endpoint<ExportPoliciesByCompanyCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Get("/policy/export/list");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting policies by company");
    }
    public override async Task HandleAsync(ExportPoliciesByCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendBytesAsync(data, "application/pdf");
    }
}