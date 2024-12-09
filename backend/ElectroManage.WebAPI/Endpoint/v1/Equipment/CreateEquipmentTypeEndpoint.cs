using ElectroManage.Application.Features.EquipmentType.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;

public class CreateEquipmentTypeEndpoint : Endpoint<CreateEquipmentTypeCommand, CreateEquipmentTypeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentType));
        Tags(RouteGroup.EquipmentType);
        Version(1);
        Post("/equipment_type");
        AllowAnonymous();
        Summary(f => f.Summary = "Create a new Equipment Type");
    }
    public async override Task HandleAsync(CreateEquipmentTypeCommand req, CancellationToken ct)
    {
       var data = await req.ExecuteAsync(ct);
       await SendAsync(data); 
    }
}