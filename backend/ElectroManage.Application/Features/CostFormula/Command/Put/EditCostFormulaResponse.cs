namespace ElectroManage.Application.Features.CostFormula.Command.Put;
public record EditCostFormulaResponse
{
    public long Id{get;set;}
    public decimal ExtraPerCent{get;set;}
    public long Increase{get;set;}

}