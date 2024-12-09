namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Put;

public record EditEfficiencyPolicyCommand : ICommand<EditEfficiencyPolicyResponse>
{
    public long Id { get; set; }
    public required string Name { get; set; } 
    public string? Description { get; set; }
}
