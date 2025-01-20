using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Company.Query.ListRegistersByCompany;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class ListRegistersByCompanyEndpoint : Endpoint<ListRegistersByCompanyCommand, IEnumerable<RegisterDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/{id}/registers");
        AllowAnonymous();
        Summary(f => f.Summary = "List Registers by Company");
    }

    public override async Task HandleAsync(ListRegistersByCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
