using ElectroManage.Application.Features.EquipmentBrand.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentBrand;

public class EquipmentBrandGetByIdEndpoint : Endpoint<EquipmentBrandGetByIdCommand, EquipmentBrandGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentBrand));
        Tags(RouteGroup.EquipmentBrand);
        Version(1);
        Get("/equipment_brand/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Get an equipment brand by it's ID");
    }
    public async override Task HandleAsync(EquipmentBrandGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}