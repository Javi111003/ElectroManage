using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Roles.Query.ListAll;

namespace ElectroManage.WebAPI.Endpoint.v1.Role;
public class ListRolesEndpoint : Endpoint<EmptyRequest, IEnumerable<RoleInfoDto>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Role));
        Tags(RouteGroup.Role);
        Version(1);
        Get("/role/list");
        AllowAnonymous();
        Summary(f => f.Summary = "Listing all existant roles");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var query = new ListRolesQuery();
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}