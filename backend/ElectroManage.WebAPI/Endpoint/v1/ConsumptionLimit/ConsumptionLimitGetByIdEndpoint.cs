using ElectroManage.Application.Features.ConsumptionLimit.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.ConsumptionLimit;
public class ConsumptionLimitGetByIdEndpoint : Endpoint<ConsumptionLimitGetByIdCommand, ConsumptionLimitGetByIdResponse>
{
    public override void Configure()
    {
        Options(x=>x.WithTags(RouteGroup.ConsumptionLimit));
        Tags(RouteGroup.ConsumptionLimit);
        Version(1);
        Get("/consumption_limit");
        AllowAnonymous();
        Summary(f => f.Summary = "Gets a Consumption Limit by it's ID.");
    }
    public async override Task HandleAsync(ConsumptionLimitGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}