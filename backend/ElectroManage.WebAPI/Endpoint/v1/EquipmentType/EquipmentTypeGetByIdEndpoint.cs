using ElectroManage.Application.Features.EquipmentType.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentType;

public class EquipmentTypeGetByIdEndpoint : Endpoint<EquipmentTypeGetByIdCommand, EquipmentTypeGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentType));
        Tags(RouteGroup.EquipmentType);
        Version(1);
        Get("/equipment_type/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Get an equipment type by it's ID");
    }
    public async override Task HandleAsync(EquipmentTypeGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}