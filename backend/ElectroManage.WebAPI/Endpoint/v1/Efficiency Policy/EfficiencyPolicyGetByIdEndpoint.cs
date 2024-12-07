using ElectroManage.Application.Features.Efficiency_Policy.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Efficiency_Policy;

public class EfficiencyPolicyGetByIdEndpoint : Endpoint<EfficiencyPolicyGetByIdCommand, EfficiencyPolicyGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Get("/policy/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Get general data of an Efficiency Policy");
    }

    public async override Task HandleAsync(EfficiencyPolicyGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
