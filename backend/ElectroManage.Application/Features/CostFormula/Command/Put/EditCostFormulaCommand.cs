using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.CostFormula.Command.Put;
public record EditCostFormulaCommand : ICommand<EditCostFormulaResponse>
{
    public required long FormulaId {get;set;}
    public required long CompanyId { get; set; }
    public string? Name { get; set; }
    public required string Expression { get; set; }
    public IEnumerable<VariableDefinitionDto> Variables { get; set; } = new HashSet<VariableDefinitionDto>();
}