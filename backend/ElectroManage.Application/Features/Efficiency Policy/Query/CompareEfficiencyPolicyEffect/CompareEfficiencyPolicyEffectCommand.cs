namespace ElectroManage.Application.Features.Efficiency_Policy.Query.CompareEfficiencyPolicyEffect;

public record CompareEfficiencyPolicyEffectQuery : ICommand<CompareEfficiencyPolicyEffectResponse>
{
    public required long CompanyId { get; set; }
    public required long EfficiencyPolicyId {get; set;}
}
