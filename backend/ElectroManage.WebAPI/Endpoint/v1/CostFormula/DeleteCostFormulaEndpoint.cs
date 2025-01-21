using ElectroManage.Application.Features.CostFormula.Command.Delete;
using ElectroManage.Common.Dtos;

namespace ElectroManage.WebAPI.Endpoint.v1.CostFormula;

public class DeleteCostFormulaEndpoint : Endpoint<EmptyRequest, Response<NoContentData>>
{
    public override void Configure()
    {
        Options(x => x.WithTags(RouteGroup.CostFormula));
        Tags(RouteGroup.CostFormula);
        Version(1);
        Delete("/cost_formula/{id}");
        AllowAnonymous();
        Summary(f => f.Summary = "Deletes a Cost Formula.");
    }
    public async override Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var query = new DeleteCostFormulaCommand() { Id = Route<long>("id") };
        var data = await query.ExecuteAsync(ct);
        await SendAsync(data);
    }
}
