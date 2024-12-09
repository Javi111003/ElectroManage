namespace ElectroManage.Application.Features.CostFormula.Query.Get;

public record CostFormulaGetByIdResponse
{
    public long Id{get;set;}
    public decimal ExtraPerCent{get;set;}
    public long Increase{get;set;}
    public DateTime Created{get;set;}
    public string Status{get;set;} = string.Empty;
}
