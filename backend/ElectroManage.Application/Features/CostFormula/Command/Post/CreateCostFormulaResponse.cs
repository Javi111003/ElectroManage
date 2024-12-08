namespace ElectroManage.Application.Features.CostFormula.Command.Post;
public record CreateCostFormulaResponse
{
    public long Id{get;set;}
    public decimal ExtraPerCent{get;set;}
    public long Increase{get;set;}
    public DateTime Created{get;set;}

}