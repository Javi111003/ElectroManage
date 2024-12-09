using ElectroManage.Application.Features.CostFormula.Query.Get;

namespace ElectroManage.WebAPI.Endpoint.v1.CostFormula;

public class CostFormulaGetByIdEndpoint : Endpoint<CostFormulaGetByIdCommand, CostFormulaGetByIdResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.CostFormula));
        Tags(RouteGroup.CostFormula);
        Version(1);
        Get("/cost_formula");
        AllowAnonymous();
        Summary(f => f.Summary = "Gets a Cost Formula by it's ID.");
    }
    public async override Task HandleAsync(CostFormulaGetByIdCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}