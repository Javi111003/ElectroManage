using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;
namespace ElectroManage.WebAPI.Endpoint.v1.Policy;
public class ListPolicyByCompanyEndpoint : Endpoint<EmptyRequest,List<ListPolicyResponse>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Get("/company/{companyId}/policy");
        AllowAnonymous();
        Summary(f => f.Summary = "List all policies applied to a company");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var companyId = Route<long>("companyId");
        var faker = new ListPolicyByCompanyBogusConfig((int)companyId);
        var data = faker.Generate(20);
        await SendAsync(data, cancellation: ct);
    }
}