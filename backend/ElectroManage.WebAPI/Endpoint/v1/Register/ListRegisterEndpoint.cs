using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mocks;

namespace ElectroManage.WebAPI.Endpoint.v1.Register;
public class ListRegisterEndpoint : Endpoint<EmptyRequest,ListRegisterResponse> 
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.Register));
        Tags(RouteGroup.Register);
        Version(1);
        Get("/register");
        AllowAnonymous();
        Summary(f => f.Summary = "Listing Daily Registers for random companies");
    }
    public override Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var faker = new ListRegisterBogusConfig();
        var data = faker.Generate(30);
        var response = new ListRegisterResponse();
        response.TotalConsumption = data.Sum(x => x.Consumption);
        response.TotalCost = data.Sum(x => x.Cost);
        response.Registers = data;
        return SendAsync(response, cancellation: ct);
    }
}