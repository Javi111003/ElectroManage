using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.ListWarningsByCompanyByMonth;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class ListWarningsByCompanyByMonthEndpoint : Endpoint<ListWarningsByCompanyByMonthCommand, IEnumerable<CountWarningByMonthDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("company/{CompanyId}/Warnings_ByMonth");
        AllowAnonymous();
        Summary(f => f.Summary = "List warnings by company by month");
    }

    public override async Task HandleAsync(ListWarningsByCompanyByMonthCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
