using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class ListMonthlastThreeYearsByCompanyEndpoint : Endpoint<EmptyRequest, List<ListMonthlastThreeYearsResponse>>
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

    public async override Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var faker = new ListMonthlastThreeYearsBogusConfig();
        var data = faker.Generate(36);
        int year = DateTime.Now.Year;
        int index = 0;
        YearCostDTO[] yearCosts = new YearCostDTO[3];
        for (int i = 0; i <= 2; i++)
        {
            var yearCost = new YearCostDTO
            {
                Year = year - i,
                MonthlyCosts = new MonthlyCostDTO[12]
            };
            for (int j = index; j < (data.Count / 3) * (i + 1); j++)
            {
                yearCost.MonthlyCosts[j % 12] = data[index];
                yearCost.MonthlyCosts[j % 12].Month = (j % 12) + 1;
                index++;
            }
            yearCost.MeanCost = yearCost.MonthlyCosts.Sum(x => x.Cost) / 12;
            yearCost.MeanConsumption = yearCost.MonthlyCosts.Sum(x => x.Consumption) / 12;
            yearCosts[i] = yearCost;
        }
        var response = new List<ListMonthlastThreeYearsResponse>
        {
            new ListMonthlastThreeYearsResponse
            {
                CompanyID = 23,
                CompanyCost = yearCosts
            }
        };
        await SendAsync(response, cancellation: ct);
    }
}
