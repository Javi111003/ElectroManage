using ElectroManage.Application.Features.Company.Query.TopFiveMostConsumption;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class GetTopFiveConsumptionEndpoint : Endpoint<EmptyRequest, GetTopFiveMostConsumptionResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.DashBoard));
        Tags(RouteGroup.DashBoard);
        Version(1);
        Get("/company/top_five/consumption");
        AllowAnonymous();
        Summary(f => f.Summary = "Get Top Five companies with most consumption");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var topFive = new GetTopFiveMostConsumptionCommand();
        var data = await topFive.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
