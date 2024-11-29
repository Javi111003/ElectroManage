using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class ListWarningsByCompanyEndpoint : Endpoint<EmptyRequest, ListWarningsByCompanyResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("company/{companyId}/list_warnings");
        AllowAnonymous();
        Summary(f => f.Summary = "Listing randoms warnings by company");
    }

    public async override Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var companyId = Route<long>("companyId");
        var faker = new ListWarningsByCompanyBogusConfig();
        var data = faker.Generate(30);
        var response = new ListWarningsByCompanyResponse
        {
            CompanyID = companyId,
            Warnings = data.OrderBy(x => x.Year).Reverse().ToList()
        };
        await SendAsync(response: response, cancellation: ct);
    }
}