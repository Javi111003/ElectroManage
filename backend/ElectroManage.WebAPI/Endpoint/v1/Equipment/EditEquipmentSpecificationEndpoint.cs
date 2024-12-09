using ElectroManage.Application.Features.EquipmentSpecification.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;
public class EditEquipmentSpecificationEndpoint : Endpoint<EditEquipmentSpecificationCommand, EditEquipmentSpecificationResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentSpecification));
        Tags(RouteGroup.EquipmentSpecification);
        Version(1);
        Put("/equipment_specification");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit an Equipment Specification");
    }    
    public async override Task HandleAsync(EditEquipmentSpecificationCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}