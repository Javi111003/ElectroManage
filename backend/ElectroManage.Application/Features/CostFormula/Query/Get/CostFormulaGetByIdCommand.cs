namespace ElectroManage.Application.Features.CostFormula.Query.Get;

public record CostFormulaGetByIdCommand : ICommand<CostFormulaGetByIdResponse>
{
    public long Id { get; set; }
}