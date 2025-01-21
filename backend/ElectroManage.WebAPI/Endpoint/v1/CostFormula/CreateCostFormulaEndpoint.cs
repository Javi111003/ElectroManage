using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.CostFormula.Command.Post;

namespace ElectroManage.WebAPI.Endpoint.v1.CostFormula;

public class CreateCostFormulaEndpoint : Endpoint<CreateCostFormulaCommand, CostFormulaDTO>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.CostFormula));
        Tags(RouteGroup.CostFormula);
        Version(1);
        Post("/cost_formula");
        AllowAnonymous();
        Summary(f => f.Summary = "Create a new Cost Formula.");
    }
    public async override Task HandleAsync(CreateCostFormulaCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}