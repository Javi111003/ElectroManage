using ElectroManage.Application.Features.EquipmentBrand.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentBrand;

public class CreateEquipmentBrandEndpoint : Endpoint<CreateEquipmentBrandCommand, CreateEquipmentBrandResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentBrand));
        Tags(RouteGroup.EquipmentBrand);
        Version(1);
        Post("/equipment_brand");
        AllowAnonymous();
        Summary(f => f.Summary = "Create a new Equipment Brand");
    }
    public async override Task HandleAsync(CreateEquipmentBrandCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}