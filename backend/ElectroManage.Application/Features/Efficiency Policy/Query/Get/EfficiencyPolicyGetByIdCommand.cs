namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Get;

public record EfficiencyPolicyGetByIdCommand : ICommand<EfficiencyPolicyGetByIdResponse>
{
    public long Id { get; set; }
}
