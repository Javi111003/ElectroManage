using ElectroManage.Application.Features.Efficiency_Policy.Query.Export.List;

namespace ElectroManage.WebAPI.Endpoint.v1.Policy;
public class ExportListPoliciesEndpoint : Endpoint<ExportListPoliciesCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Get("/policy/export/list");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting policies");
    }
    public override async Task HandleAsync(ExportListPoliciesCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendBytesAsync(data, "application/pdf");
    }
}