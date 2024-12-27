using ElectroManage.Application.Features.EquipmentType.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;

public class ListEquipmentTypeEndpoint : Endpoint<EmptyRequest, ListEquipmentTypeResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentType));
        Tags(RouteGroup.EquipmentType);
        Version(1);
        Get("/equipment_type");
        AllowAnonymous();
        Summary(f => f.Summary = "List equipment types");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var list = new ListEquipmentTypeCommand();
        var data = await list.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
