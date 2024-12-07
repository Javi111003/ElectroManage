using ElectroManage.Application.Features.Efficiency_Policy.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.Efficiency_Policy;

public class EditEfficiencyPolicyEndpoint : Endpoint<EditEfficiencyPolicyCommand, EditEfficiencyPolicyResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Put("/policy/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit an Efficiency Policy");
    }

    public async override Task HandleAsync(EditEfficiencyPolicyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
