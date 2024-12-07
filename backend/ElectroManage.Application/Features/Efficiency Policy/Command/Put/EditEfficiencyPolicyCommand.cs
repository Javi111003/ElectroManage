namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Put;

public record EditEfficiencyPolicyCommand : ICommand<EditEfficiencyPolicyResponse>
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
