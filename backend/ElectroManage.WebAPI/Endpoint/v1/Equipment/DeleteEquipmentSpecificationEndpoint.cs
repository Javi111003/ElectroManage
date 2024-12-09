using ElectroManage.Application.Features.EquipmentSpecification.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;
public class DeleteEquipmentSpecificationEndpoint : Endpoint<DeleteEquipmentSpecificationCommand,Response<NoContentData> >
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentSpecification));
        Tags(RouteGroup.EquipmentSpecification);
        Version(1);
        Delete("/equipment_specification");
        AllowAnonymous();
        Summary(f => f.Summary = "Deletes an Equipment Specification");
    }    
    public async override Task HandleAsync(DeleteEquipmentSpecificationCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}