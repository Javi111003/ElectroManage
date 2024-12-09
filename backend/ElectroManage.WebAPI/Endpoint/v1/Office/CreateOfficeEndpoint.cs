using ElectroManage.Application.Features.Office;
using ElectroManage.Application.Features.Office.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.Office;

public class CreateOfficeEndpoint : Endpoint<CreateOfficeCommand, OfficeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Office));
        Tags(RouteGroup.Office);
        Version(1);
        Post("/office");
        AllowAnonymous();
        Summary(f => f.Summary = "Create a new Office");
    }

    public override async Task HandleAsync(CreateOfficeCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
