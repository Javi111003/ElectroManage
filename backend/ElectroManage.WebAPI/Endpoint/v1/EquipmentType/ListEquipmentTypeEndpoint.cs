using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.EquipmentType.Query.ListAll;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentType;
public class ListEquipmentTypeEndpoint : Endpoint<EmptyRequest, IEnumerable<EquipmentTypeDTO>>
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
        var list = new ListEquipmentTypeQuery();
        var data = await list.ExecuteAsync(ct);
        await SendAsync(data);
    }
}