using ElectroManage.Application.Features.AppUser.Query.Export.List;

namespace ElectroManage.WebAPI.Endpoint.v1.AppUser;
public class ExportListAppUsersEndpoint : Endpoint<ExportListAppUsersCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.User));
        Tags(RouteGroup.User);
        Version(1);
        Get("/user/export");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting app users");
    }
    public override async Task HandleAsync(ExportListAppUsersCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}