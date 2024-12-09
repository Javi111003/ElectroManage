using ElectroManage.Application.Features.EquipmentSpecification.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;
public class CreateEquipmentSpecificationEndpoint : Endpoint<CreateEquipmentSpecificationCommand, CreateEquipmentSpecificationResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentSpecification));
        Tags(RouteGroup.EquipmentSpecification);
        Version(1);
        Post("/equipment_specification");
        AllowAnonymous();
        Summary(f => f.Summary = "Create a new Equipment Specification");
    }    
    public async override Task HandleAsync(CreateEquipmentSpecificationCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}