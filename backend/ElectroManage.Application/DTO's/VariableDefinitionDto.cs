namespace ElectroManage.Application.DTO_s;
public record VariableDefinitionDto
{
    public required string VariableName { get; set; }
    public double? Value { get; set; }
    public string? Expression { get; set; }
}