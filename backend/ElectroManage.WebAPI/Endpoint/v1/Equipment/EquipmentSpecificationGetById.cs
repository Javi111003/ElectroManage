using ElectroManage.Application.Features.EquipmentSpecification.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;
public class EquipmentSpecificationGetByIdEndpoint : Endpoint<EquipmentSpecificationGetByIdCommand, EquipmentSpecificationGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentSpecification));
        Tags(RouteGroup.EquipmentSpecification);
        Version(1);
        Get("/equipment_specification");
        AllowAnonymous();
        Summary(f => f.Summary = "Gets a Equipment Specification by it's ID.");
    }    
    public async override Task HandleAsync(EquipmentSpecificationGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
