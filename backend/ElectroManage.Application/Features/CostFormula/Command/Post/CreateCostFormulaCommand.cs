namespace ElectroManage.Application.Features.CostFormula.Command.Post;
public record CreateCostFormulaCommand : ICommand<CreateCostFormulaResponse>
{
    public required long CompanyId { get; set; }
    public decimal ExtraPerCent {get;set;} = 15;
    public long Increase{get;set;} = 20;
}