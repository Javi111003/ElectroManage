using ElectroManage.Application.Features.Register.Command.Delete;
using ElectroManage.Application.Features.Warning.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Register
{
    public class DeleteRegisterEndpoint : Endpoint<DeleteRegisterCommand, Response<NoContentData>>
    {
        public override void Configure()
        {
            Options(x => x.WithTags(RouteGroup.Register));
            Tags(RouteGroup.Register);
            Version(1);
            Delete("/register/{id}");
            AllowAnonymous();
            Summary(f => f.Summary = "Delete a register");
        }

        public override async Task HandleAsync(DeleteRegisterCommand req, CancellationToken ct)
        {
            var data = await req.ExecuteAsync(ct);
            await SendAsync(data);
        }
    }
}
