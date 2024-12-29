using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.EquipmentBrand.Query.ListAll;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentBrand;

public class ListEquipmentBrandEndpoint : Endpoint<EmptyRequest, IEnumerable<EquipmentBrandDTO>>
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
        var list = new ListEquipmentBrandQuery();
        var data = await list.ExecuteAsync(ct);
        await SendAsync(data);
    }
}