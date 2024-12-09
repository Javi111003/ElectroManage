using ElectroManage.Application.Features.CostFormula.Command.Put;

namespace ElectroManage.WebAPI.Endpoint.v1.CostFormula;

public class EditCostFormulaEndpoint : Endpoint<EditCostFormulaCommand, EditCostFormulaResponse>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.CostFormula));
        Tags(RouteGroup.CostFormula);
        Version(1);
        Put("/cost_formula");
        AllowAnonymous();
        Summary(f => f.Summary = "Edits a Cost Formula.");
    }
    public async override Task HandleAsync(EditCostFormulaCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}