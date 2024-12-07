using ElectroManage.Application.Features.Administrative_Area.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Administrative_Area;

public class AdministrativeAreaGetByIdEndpoint : Endpoint<AdministrativeAreaGetByIdCommand, AdministrativeAreaGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.AdminstrativeArea));
        Tags(RouteGroup.AdminstrativeArea);
        Version(1);
        Get("/administrative_area");
        AllowAnonymous();
        Summary(f => f.Summary = "Get Administrative Area by Id");
    }

    public async override Task HandleAsync(AdministrativeAreaGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
