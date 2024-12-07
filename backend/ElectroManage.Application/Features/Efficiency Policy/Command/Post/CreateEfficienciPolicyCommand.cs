namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Post;

public record CreateEfficienciPolicyCommand : ICommand<CreateEfficiencyPolicyResponse>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
