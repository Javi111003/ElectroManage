using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Efficiency_Policy.Query.CompareEfficiencyPolicyEffect;

namespace ElectroManage.WebAPI.Endpoint.v1.Efficiency_Policy;
public class CompareEfficiencyPolicyEffectEndpoint : Endpoint<CompareEfficiencyPolicyEffectQuery, CompareEfficiencyPolicyEffectResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Get("/policy/compare");
        AllowAnonymous();
        Summary(f => f.Summary = "Compare consumption and cost of a company, before and after the application of an Efficiency Policy");
    }
    public override async Task HandleAsync(CompareEfficiencyPolicyEffectQuery req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}