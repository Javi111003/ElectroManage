using ElectroManage.Application.Features.AppUser.Query;
using Microsoft.AspNetCore.Authorization;

namespace ElectroManage.WebAPI.Endpoint.v1.AppUser;
public class ListAppUsersEndpoint : Endpoint<EmptyRequest,ListAppUsersResponse>
{
    public override void Configure()
    {
        Policies("UserPolicy");
        Options(x => x.WithTags(RouteGroup.User));
        Tags(RouteGroup.User);
        Version(1);
        Get("/user");
        Summary(f => f.Summary = "Listing all app users");
    }

    public override async Task HandleAsync(EmptyRequest Request,CancellationToken ct)
    {
        var data = await new ListAppUsersQuery().ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}