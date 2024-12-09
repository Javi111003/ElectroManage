using ElectroManage.Application.Features.EquipmentBrand.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;

public class DeleteEquipmentBrandEndpoint : Endpoint<DeleteEquipmentBrandCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentBrand));
        Tags(RouteGroup.EquipmentBrand);
        Version(1);
        Delete("/equipment_brand/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Delete an Equipment Brand");
    }

    public override async Task HandleAsync(DeleteEquipmentBrandCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
