using ElectroManage.Application.Features.Company.Query.Get;
using ElectroManage.Application.DTO_s;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class CompanyGetByIdEndpoint : Endpoint<CompanyGetByIdCommand,  CompanyResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Get general data of a Company");
    }

    public override async Task HandleAsync(CompanyGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
