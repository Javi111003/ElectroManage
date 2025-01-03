using ElectroManage.Application.Features.Office.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Office;

public class DeleteOfficeEndpoint : Endpoint<DeleteOfficeCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Office));
        Tags(RouteGroup.Office);
        Version(1);
        Delete("/office/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Delete a Office");
    }

    public override async Task HandleAsync(DeleteOfficeCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
