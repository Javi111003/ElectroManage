using ElectroManage.Application.Features.Efficiency_Policy.Query.Export.Comparison;

namespace ElectroManage.WebAPI.Endpoint.v1.Efficiency_Policy;
public class ExportPolicyComparisonByCompanyEndpoint : Endpoint<ExportPolicyComparisonCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Get("/policy/export/comparison");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting policy comparison");
    }
    public override async Task HandleAsync(ExportPolicyComparisonCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}