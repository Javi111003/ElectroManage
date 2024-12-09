namespace ElectroManage.Application.Features.CostFormula.Command.Put;
public record EditCostFormulaCommand : ICommand<EditCostFormulaResponse>
{
    public long Id {get;set;}
    public decimal ExtraPerCent {get;set;} = 15;
    public long Increase{get;set;} = 20;
}