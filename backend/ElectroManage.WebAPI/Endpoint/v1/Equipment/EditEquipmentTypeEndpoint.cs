using ElectroManage.Application.Features.EquipmentType.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;

public class EditEquipmentTypeEndpoint : Endpoint<EditEquipmentTypeCommand, EditEquipmentTypeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentType));
        Tags(RouteGroup.EquipmentType);
        Version(1);
        Put("/equipment_type");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit equipment type");
    }
    public async override Task HandleAsync(EditEquipmentTypeCommand req, CancellationToken ct)
    {
       var data = await req.ExecuteAsync(ct);
       await SendAsync(data); 
    }
}