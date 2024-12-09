namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Post;

public record CreateEfficienciPolicyCommand : ICommand<CreateEfficiencyPolicyResponse>
{
    public required string Name { get; set; } 
    public string? Description { get; set; }
}
