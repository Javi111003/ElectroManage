using ElectroManage.Application.Features.Efficiency_Policy.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.Efficiency_Policy;

public class CreateEfficiencyPolicyEndpoint : Endpoint<CreateEfficienciPolicyCommand, CreateEfficiencyPolicyResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Post("/policies");
        AllowAnonymous();
        Summary(f => f.Summary = "Creating new Efficiency Policy");
    }

    public async override Task HandleAsync(CreateEfficienciPolicyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
