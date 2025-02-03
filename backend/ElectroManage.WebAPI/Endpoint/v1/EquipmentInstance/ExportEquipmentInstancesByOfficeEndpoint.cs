using ElectroManage.Application.Features.EquipmentInstance.Query.Export.List;

namespace ElectroManage.WebAPI.Endpoint.v1.EquipmentInstance;
public class ExportEquipmentInstancesByOfficeEndpoint : Endpoint<ExportEquipmentInstancesByOfficeCommand, byte[]>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Equipment));
        Tags(RouteGroup.Equipment);
        Version(1);
        Get("/equipment/export");
        AllowAnonymous();
        Summary(f => f.Summary = "Exporting equipment instances in an office");
    }
    public override async Task HandleAsync(ExportEquipmentInstancesByOfficeCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }

}