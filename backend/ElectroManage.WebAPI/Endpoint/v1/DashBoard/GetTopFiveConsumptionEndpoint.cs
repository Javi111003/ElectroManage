using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.TopFiveMostConsumption;

namespace ElectroManage.WebAPI.Endpoint.v1.Dashboard;

public class GetTopFiveConsumptionEndpoint : Endpoint<EmptyRequest, IEnumerable<ConsumptionDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.DashBoard));
        Tags(RouteGroup.DashBoard);
        Version(1);
        Get("/dashboard/top_five/company_consumption");
        AllowAnonymous();
        Summary(f => f.Summary = "Get Top Five companies with most consumption");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var topFive = new GetTopFiveMostConsumptionQuery();
        var data = await topFive.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
