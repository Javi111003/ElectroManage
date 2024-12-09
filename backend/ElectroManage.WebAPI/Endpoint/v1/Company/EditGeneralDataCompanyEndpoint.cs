using ElectroManage.Application.Features.Company.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.Company;

public class EditGeneralDataCompanyEndpoint : Endpoint<EditGeneralDataCompanyCommand, EditGeneralDataCompanyResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Company));
        Tags(RouteGroup.Company);
        Version(1);
        Put("/company/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit general data of a Comapny");
    }

    public override async Task HandleAsync(EditGeneralDataCompanyCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
