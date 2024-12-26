using ElectroManage.Application.Features.EquipmentInstance.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentInstance;

public class DeleteEquipmentInstanceEndpoint : Endpoint<DeleteEquipmentInstanceCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Equipment));
        Tags(RouteGroup.Equipment);
        Version(1);
        Delete("/equipment/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Delete an Equipment Instance");
    }

    public override async Task HandleAsync(DeleteEquipmentInstanceCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
