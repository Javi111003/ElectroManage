using ElectroManage.Application.Features.EquipmentSpecification.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;
public class DeleteEquipmentSpecificationEndpoint : Endpoint<EmptyRequest, Response<NoContentData> >
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.EquipmentSpecification));
        Tags(RouteGroup.EquipmentSpecification);
        Version(1);
        Delete("/equipment_specification/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Deletes an Equipment Specification");
    }    
    public async override Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var query = new DeleteEquipmentSpecificationCommand() { Id = Route<long>("id") };
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data, cancellation: ct);
    }
}