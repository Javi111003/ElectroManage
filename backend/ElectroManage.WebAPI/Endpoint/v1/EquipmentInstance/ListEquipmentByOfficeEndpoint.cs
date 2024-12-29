using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.EquipmentInstance.Query.ListEquipmentByOffice;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentInstance;
public class ListEquipmentByOfficeEndpoint : Endpoint<ListEquipmentByOfficeQuery, IEnumerable<EquipmentInstanceDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Equipment));
        Tags(RouteGroup.Equipment);
        Version(1);
        Get("/equipment/list_equipment_by_office");
        AllowAnonymous();
        Summary(f => f.Summary = "List all equipment instances associated to an Office.");
    }    
    public async override Task HandleAsync(ListEquipmentByOfficeQuery req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}