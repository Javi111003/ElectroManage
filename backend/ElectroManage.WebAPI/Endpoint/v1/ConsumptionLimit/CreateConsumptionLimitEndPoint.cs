using ElectroManage.Application.Features.ConsumptionLimit.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.ConsumptionLimit;
public class CreateConsumptionLimitEndpoint : Endpoint<CreateConsumptionLimitCommand, CreateConsumptionLimitResponse>
{
    public override void Configure()
    {
        Options(x=>x.WithTags(RouteGroup.ConsumptionLimit));
        Tags(RouteGroup.ConsumptionLimit);
        Version(1);
        Post("/consumption_limit");
        AllowAnonymous();
        Summary(f => f.Summary = "Create a new Consumption Limit.");
    }
    public async override Task HandleAsync(CreateConsumptionLimitCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}