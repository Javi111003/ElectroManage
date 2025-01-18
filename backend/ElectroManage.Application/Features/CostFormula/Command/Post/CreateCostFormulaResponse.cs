using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.CostFormula.Command.Post;
public record CreateCostFormulaResponse
{
    public long Id{get;set;}
    public string? Name {get;set;}
    public string Expression {get;set;} = string.Empty;
    public DateTime Created{get;set;}
    public IEnumerable<VariableDefinitionDto> Variables { get; set; } = new HashSet<VariableDefinitionDto>();
}