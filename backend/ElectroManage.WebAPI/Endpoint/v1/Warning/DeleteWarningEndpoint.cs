using ElectroManage.Application.Features.Warning.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Warning;

public class DeleteWarningEndpoint : Endpoint<DeleteWarningCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Warning));
        Tags(RouteGroup.Warning);
        Version(1);
        Delete("/warning/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Delete a warning");
    }

    public override async Task HandleAsync(DeleteWarningCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
