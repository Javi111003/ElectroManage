using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class ListMonthlastThreeYearsByCompanyEndpoint : Endpoint<CollectionIdsDto, List<ListMonthlastThreeYearsResponse>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/last_three_years");
        AllowAnonymous();
        Summary(f => f.Summary = "Listing Cost and Consumption during the last three years");
    }

    public async override Task HandleAsync(CollectionIdsDto req, CancellationToken ct)
    {
        var faker = new ListMonthlastThreeYearsBogusConfig();
        var response = new List<ListMonthlastThreeYearsResponse>();
        foreach (var id in req.Ids)
        {
            int year = DateTime.Now.Year - 1;
            var data = faker.Generate(3);
            data.ForEach(x => x.Year = year--);
            response.Add(new ListMonthlastThreeYearsResponse
            {
                CompanyID = id,
                YearCostDto = data
            });
        }
        await SendAsync(response, cancellation: ct);
    }
}