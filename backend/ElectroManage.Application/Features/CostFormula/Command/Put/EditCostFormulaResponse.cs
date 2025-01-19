using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.CostFormula.Command.Put;
public record EditCostFormulaResponse
{
    public long Id{get;set;}
    public string? Name { get; set; }
    public string Expression { get; set; } = string.Empty;
    public IEnumerable<VariableDefinitionDto> Variables { get; set; } = new HashSet<VariableDefinitionDto>();
}