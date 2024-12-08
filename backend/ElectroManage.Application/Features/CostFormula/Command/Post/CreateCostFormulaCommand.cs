namespace ElectroManage.Application.Features.CostFormula.Command.Post;
public record CreateCostFormulaCommand : ICommand<CreateCostFormulaResponse>
{
    public decimal ExtraPerCent {get;set;} = 15;
    public long Increase{get;set;} = 20;
}