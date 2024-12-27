using ElectroManage.Application.Features.EquipmentBrand.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;

public class ListEquipmentBrandEndpoint : Endpoint<EmptyRequest, ListEquipmentBrandResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentBrand));
        Tags(RouteGroup.EquipmentBrand);
        Version(1);
        Get("/equipment_brand");
        AllowAnonymous();
        Summary(f => f.Summary = "List all equipment brands");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var list = new ListEquipmentBrandCommand();
        var data = await list.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
