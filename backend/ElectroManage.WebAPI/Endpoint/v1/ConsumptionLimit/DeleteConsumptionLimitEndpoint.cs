using ElectroManage.Application.Features.ConsumptionLimit.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.ConsumptionLimit;
public class DeleteConsumptionLimitEndpoint : Endpoint<DeleteConsumptionLimitCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x=>x.WithTags(RouteGroup.ConsumptionLimit));
        Tags(RouteGroup.ConsumptionLimit);
        Version(1);
        Delete("/consumption_limit");
        AllowAnonymous();
        Summary(f => f.Summary = "Deletes a Consumption Limit.");
    }
    public async override Task HandleAsync(DeleteConsumptionLimitCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}