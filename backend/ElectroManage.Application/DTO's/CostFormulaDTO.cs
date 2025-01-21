namespace ElectroManage.Application.DTO_s;

public record CostFormulaDTO
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string Expression { get; set; } = string.Empty;
    public IEnumerable<VariableDefinitionDto> Variables { get; set; } = new HashSet<VariableDefinitionDto>();
}