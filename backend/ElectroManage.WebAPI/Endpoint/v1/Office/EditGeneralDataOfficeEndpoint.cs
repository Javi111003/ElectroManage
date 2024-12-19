using ElectroManage.Application.Features.Office;
using ElectroManage.Application.Features.Office.Command.Post;
using ElectroManage.Application.Features.Office.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.Office;

public class EditGeneralDataOfficeEndpoint : Endpoint<EditGeneralDataOfficeCommand, OfficeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Office));
        Tags(RouteGroup.Office);
        Version(1);
        Put("/office/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit general data of an Office");
    }

    public override async Task HandleAsync(EditGeneralDataOfficeCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
