namespace ElectroManage.Application.DTO_s;
public record VariableDefinitionDto
{
    public required string VariableName { get; set; }
    public string? Expression { get; set; }
}