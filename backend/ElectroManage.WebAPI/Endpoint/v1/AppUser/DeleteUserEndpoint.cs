using ElectroManage.Application.Features.AppUser.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.AppUser;

public class DeleteUserEndpoint : Endpoint<DeleteUserCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.User));
        Tags(RouteGroup.User);
        Version(1);
        Delete("/user/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Delete an user");
    }

    public async override Task HandleAsync(DeleteUserCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
