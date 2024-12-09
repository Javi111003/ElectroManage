using ElectroManage.Application.Features.EquipmentType.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;

public class DeleteEquipmentTypeEndpoint : Endpoint<DeleteEquipmentTypeCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentType));
        Tags(RouteGroup.EquipmentType);
        Version(1);
        Delete("/equipment_type/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Delete an Equipment Type");
    }

    public override async Task HandleAsync(DeleteEquipmentTypeCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
