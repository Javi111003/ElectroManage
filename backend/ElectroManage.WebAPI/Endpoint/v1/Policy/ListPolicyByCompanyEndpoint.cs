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
        Get("/company/{companyId}/list_policies");
        AllowAnonymous();
        Summary(f => f.Summary = "List all policies applied to a company");
    }
    public override async Task HandleAsync(ListEfficiencyPoliciesByCompanyQuery req, CancellationToken ct)
    {
        var companyId = Route<long>("companyId");
        var query = new ListEfficiencyPoliciesByCompanyQuery() { CompanyId = companyId };
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data, cancellation:ct);
    }
}