using ElectroManage.Application.Features.EquipmentInstance.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentInstance;

public class CreateEquipmentBrandEndpoint : Endpoint<CreateEquipmentInstanceCommand, CreateEquipmentInstanceResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Equipment));
        Tags(RouteGroup.Equipment);
        Version(1);
        Post("/equipment");
        AllowAnonymous();
        Summary(f => f.Summary = "Create a new Equipment Instance");
    }
    public async override Task HandleAsync(CreateEquipmentInstanceCommand req, CancellationToken ct)
    {
       var data = await req.ExecuteAsync(ct);
       await SendAsync(data); 
    }
}