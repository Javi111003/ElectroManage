using ElectroManage.Application.Features.AppUser.Query.GetById;

namespace ElectroManage.WebAPI.Endpoint.v1.AppUser;
public class GetUserByIdEndpoint : Endpoint<EmptyRequest, GetUserByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.User));
        Tags(RouteGroup.User);
        Version(1);
        Get("/user/{userId}");
        AllowAnonymous();
        Summary(f => f.Summary = "Get user info by id");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var query = new GetUserByIdQuery()
        {
            Id = Route<long>("userId")
        };
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}