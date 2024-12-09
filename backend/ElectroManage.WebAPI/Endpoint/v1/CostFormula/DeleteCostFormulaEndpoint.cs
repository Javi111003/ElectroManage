using ElectroManage.Application.Features.CostFormula.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.CostFormula;

public class DeleteCostFormulaEndpoint : Endpoint<DeleteCostFormulaCommand, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.CostFormula));
        Tags(RouteGroup.CostFormula);
        Version(1);
        Delete("/cost_formula");
        AllowAnonymous();
        Summary(f => f.Summary = "Deletes a Cost Formula.");
    }
    public async override Task HandleAsync(DeleteCostFormulaCommand req, CancellationToken ct)
    {
        var data = await req.ExecuteAsync(ct);
        await SendAsync(data);
    }
}