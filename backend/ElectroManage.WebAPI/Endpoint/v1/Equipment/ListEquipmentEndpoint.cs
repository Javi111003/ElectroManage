using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;
public class ListEquipmentEndpoint : Endpoint<EmptyRequest,List<ListEquipmentResponse>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Equipment));
        Tags(RouteGroup.Equipment);
        Version(1);
        AllowAnonymous();
        Get("/equipment");
        Summary(f => f.Summary = "List random equipments");
    }
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var faker = new ListEquipmentBogusConfig();
        var data = faker.Generate(30);
        await SendAsync(data, cancellation: ct);
    }
}
