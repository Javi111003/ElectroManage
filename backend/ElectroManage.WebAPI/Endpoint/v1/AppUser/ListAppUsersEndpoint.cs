using ElectroManage.Application.Features.AppUser.Query.ListAppUsers;

namespace ElectroManage.WebAPI.Endpoint.v1.AppUser;
public class ListAppUsersEndpoint : Endpoint<EmptyRequest,ListAppUsersResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.User));
        Tags(RouteGroup.User);
        Version(1);
        Get("/user");
        AllowAnonymous();
        Summary(f => f.Summary = "Listing all app users");
    }

    public override async Task HandleAsync(EmptyRequest Request,CancellationToken ct)
    {
        var data = await new ListAppUsersQuery().ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}