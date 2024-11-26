using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Equipment;
public class ListEquipmentByOfficeEndpoint : Endpoint<EmptyRequest, List<ListEquipmentByOfficeResponse>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Equipment));
        Tags(RouteGroup.Equipment);
        Version(1);
        AllowAnonymous();
        Get("/company/{companyId}/office/{officeId}/equipments");
        Summary(f => f.Summary = "List equipments associated to an office");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var companyId = Route<long>("companyId");
        var officeId = Route<long>("officeId");
        var faker = new ListEquipmentByOfficeBogusConfig();
        var data = faker.Generate(40);
        data.ForEach(d =>
            {
                d.CompanyId = companyId;
                d.OfficeId = officeId;
            });
        await SendAsync(data, cancellation: ct);
    }
}