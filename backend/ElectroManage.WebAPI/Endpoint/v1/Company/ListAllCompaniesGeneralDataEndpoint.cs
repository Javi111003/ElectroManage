using ElectroManage.Application.Features.Company.Query.ListAllGeneralData;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class ListAllCompaniesGeneralDataEndpoint : Endpoint<EmptyRequest, ListAllCompaniesGeneralDataResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company");
        AllowAnonymous();
        Summary(f => f.Summary = "List Companies with their general data");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var list = new ListAllCompaniesGeneralDataCommand();
        var data = await list.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
