using ElectroManage.Application.Features.EquipmentInstance.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentInstance;

public class EditEquipmentInstanceEndpoint : Endpoint<EditEquipmentInstanceCommand, EditEquipmentInstanceResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Equipment));
        Tags(RouteGroup.Equipment);
        Version(1);
        Put("/equipment/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Edit an Equipment Instance");
    }

    public async override Task HandleAsync(EditEquipmentInstanceCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
