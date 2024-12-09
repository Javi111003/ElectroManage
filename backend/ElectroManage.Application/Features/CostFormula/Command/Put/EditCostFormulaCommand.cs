namespace ElectroManage.Application.Features.CostFormula.Command.Put;
public record EditCostFormulaCommand : ICommand<EditCostFormulaResponse>
{
    public required long FormulaId {get;set;}
    public required long CompanyId { get; set; }
    public decimal ExtraPerCent {get;set;} = 15;
    public long Increase{get;set;} = 20;
}