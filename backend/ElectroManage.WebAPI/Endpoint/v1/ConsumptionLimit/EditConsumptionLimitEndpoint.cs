using ElectroManage.Application.Features.ConsumptionLimit.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.ConsumptionLimit;
public class EditConsumptionLimitEndpoint : Endpoint<EditConsumptionLimitCommand, EditConsumptionLimitResponse>
{
    public override void Configure()
    {
        Options(x=>x.WithTags(RouteGroup.ConsumptionLimit));
        Tags(RouteGroup.ConsumptionLimit);
        Version(1);
        Put("/consumption_limit");
        AllowAnonymous();
        Summary(f => f.Summary = "Edits a Consumption Limit.");
    }
    public async override Task HandleAsync(EditConsumptionLimitCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}