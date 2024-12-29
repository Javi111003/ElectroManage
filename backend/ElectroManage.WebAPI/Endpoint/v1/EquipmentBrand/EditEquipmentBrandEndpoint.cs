using ElectroManage.Application.Features.EquipmentBrand.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentBrand;

public class EditEquipmentBrandEndpoint : Endpoint<EditEquipmentBrandCommand, EditEquipmentBrandResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentBrand));
        Tags(RouteGroup.EquipmentBrand);
        Version(1);
        Put("/equipment_brand");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit equipment brand");
    }
    public async override Task HandleAsync(EditEquipmentBrandCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}