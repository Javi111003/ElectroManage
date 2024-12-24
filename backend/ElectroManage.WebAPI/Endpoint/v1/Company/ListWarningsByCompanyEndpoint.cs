using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.ListWarningsByCompany;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class ListWarningsByCompanyEndpoint : Endpoint<ListWarningsByCompanyCommand, ListWarningsByCompanyResponse>
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

    public override async Task HandleAsync(ListWarningsByCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        data.Warnings.OrderBy(x => x.Year);
        await SendAsync(data);
    }
}