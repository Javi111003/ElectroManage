using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.EquipmentInstance.Query.ListEquipmentByOffice;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentInstance;
public class ListEquipmentByOfficeEndpoint : Endpoint<EmptyRequest, IEnumerable<EquipmentInstanceDTO>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Equipment));
        Tags(RouteGroup.Equipment);
        Version(1);
        Get("/office/{officeId}/list_policies");
        AllowAnonymous();
        Summary(f => f.Summary = "List all equipment instances associated to an Office.");
    }    
    public async override Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var officeId = Route<long>("officeId");
        var query = new ListEquipmentByOfficeQuery() { OfficeId = officeId };
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data, cancellation:ct);
    }
}