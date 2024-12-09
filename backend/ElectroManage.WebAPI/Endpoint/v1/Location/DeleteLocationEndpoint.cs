using ElectroManage.Application.Features.Location.Command.Delete;
using ElectroManage.Application.Features.Warning.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Location
{
    public class DeleteLocationEndpoint : Endpoint<DeleteLocationCommand, Response<NoContentData>>
    {
        public override void Configure()
        {
            Options(x => x.WithTags(RouteGroup.Location));
            Tags(RouteGroup.Location);
            Version(1);
            Delete("/location/{id}");
            AllowAnonymous();
            Summary(f => f.Summary = "Delete a location");
        }

        public override async Task HandleAsync(DeleteLocationCommand req, CancellationToken ct)
        {
            var data = await req.ExecuteAsync(ct);
            await SendAsync(data);
        }
    }
}
