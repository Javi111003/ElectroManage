using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;
using System.Net;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;

public class ListEquipmentByCompanyEndpoint : Endpoint<EmptyRequest, List<ListEquipmentByCompanyResponse>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Equipment));
        Tags(RouteGroup.Equipment);
        Version(1);
        AllowAnonymous();
        Get("/equipment/companyId");
        Summary(f => f.Summary = "List random equipments by company");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var faker = new ListEquipmentByCompanyBogusConfig();
        var data = faker.Generate(40);
        await SendAsync(data, cancellation: ct);
    }
}
