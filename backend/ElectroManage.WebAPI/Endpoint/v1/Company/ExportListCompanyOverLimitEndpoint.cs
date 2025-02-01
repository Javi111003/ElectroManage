using ElectroManage.Application.Features.Company.Query.Export.ListCompanyOverLimit;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;
public class ExportListCompanyOverLimitEndpoint : Endpoint<ExportListCompanyOverLimitCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/export/over_limit");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting companies over the limit in a given date");
    }
    public override async Task HandleAsync(ExportListCompanyOverLimitCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendBytesAsync(data, "application/pdf");
    }
}