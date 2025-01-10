using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Put;

public record EditEfficiencyPolicyCommand : ICommand<EfficiencyPolicyDTO>
{
    public long Id { get; set; }
    public required string Name { get; set; } 
    public string? Description { get; set; }
}
