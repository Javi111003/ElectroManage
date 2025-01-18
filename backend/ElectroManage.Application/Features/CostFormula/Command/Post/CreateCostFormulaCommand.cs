using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.CostFormula.Command.Post;
public record CreateCostFormulaCommand : ICommand<CreateCostFormulaResponse>
{
    public required long CompanyId { get; set; }
    public string? Name { get; set; }
    public required string Expression { get; set; }
    public IEnumerable<VariableDefinitionDto> Variables { get; set; } = new HashSet<VariableDefinitionDto>();
}