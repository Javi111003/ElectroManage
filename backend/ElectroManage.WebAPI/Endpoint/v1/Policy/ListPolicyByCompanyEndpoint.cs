using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Efficiency_Policy.Query.ListEfficiencyPoliciesByCompany;
namespace ElectroManage.WebAPI.Endpoint.v1.Policy;
public class ListPoliciesByCompanyEndpoint : Endpoint<ListEfficiencyPoliciesByCompanyQuery,IEnumerable<EfficiencyPolicyDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Get("/company/list_policies_by_company");
        AllowAnonymous();
        Summary(f => f.Summary = "List all policies applied to a company");
    }
    public override async Task HandleAsync(ListEfficiencyPoliciesByCompanyQuery req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data, cancellation:ct);
    }
}