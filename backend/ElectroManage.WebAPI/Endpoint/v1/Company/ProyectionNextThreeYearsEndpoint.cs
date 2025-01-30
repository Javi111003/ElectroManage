using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.ProyectionNextThreeMonth;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class ProyectionNextThreeYearsEndpoint : Endpoint<ProyectionNextThreeMonthCommand, IEnumerable<ProyectionNextThreeMonthResponse>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("company/Proyection_Next_Three_Months");
        AllowAnonymous();
        Summary(f => f.Summary = "Proyection Next Three Months");
    }

    public override async Task HandleAsync(ProyectionNextThreeMonthCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
