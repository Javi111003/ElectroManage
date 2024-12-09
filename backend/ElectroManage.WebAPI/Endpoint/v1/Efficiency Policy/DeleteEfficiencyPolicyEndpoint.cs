using ElectroManage.Application.Features.Efficiency_Policy.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Efficiency_Policy;

public class DeleteEfficiencyPolicyEndpoint : Endpoint<DeleteEfficiencyPolicyCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Policy));
        Tags(RouteGroup.Policy);
        Version(1);
        Delete("/efficiency_policy/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Delete an Eficiency Policy");
    }

    public override async Task HandleAsync(DeleteEfficiencyPolicyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
