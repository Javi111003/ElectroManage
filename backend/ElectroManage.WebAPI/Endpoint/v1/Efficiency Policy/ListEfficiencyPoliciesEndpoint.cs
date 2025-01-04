using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Efficiency_Policy.Query.ListAll;

namespace ElectroManage.WebAPI.Endpoint.v1.Efficiency_Policy;
public class ListEfficiencyPoliciesEndpoint : Endpoint<EmptyRequest, IEnumerable<EfficiencyPolicyDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Get("/policy/list");
        AllowAnonymous();
        Summary(f => f.Summary = "Listing all existant efficiency polices");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var query = new ListEfficiencyPoliciesQuery();
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}