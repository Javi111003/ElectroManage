using ElectroManage.Application.Features.Company.Query.GetRegisters;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class GetRegisterByCompanyEndpoint : Endpoint<GetRegisterByCompanyCommand, GetRegisterByCompanyResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Get("/company/{id}/registers");
        AllowAnonymous();
        Summary(f => f.Summary = "Get Registers by Company Id");
    }

    public override async Task HandleAsync(GetRegisterByCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
