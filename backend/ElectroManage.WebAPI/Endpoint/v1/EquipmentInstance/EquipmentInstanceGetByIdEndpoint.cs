using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.EquipmentInstance.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentInstance;
public class EquipmentInstanceGetByIdEndpoint : Endpoint<EquipmentInstanceGetByIdCommand, EquipmentInstanceDTO>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Equipment));
        Tags(RouteGroup.Equipment);
        Version(1);
        Get("/equipment");
        AllowAnonymous();
        Summary(f => f.Summary = "Gets a Equipment by it's ID.");
    }    
    public async override Task HandleAsync(EquipmentInstanceGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}