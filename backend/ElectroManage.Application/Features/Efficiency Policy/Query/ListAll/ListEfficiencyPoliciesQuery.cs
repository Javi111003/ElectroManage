using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.ListAll;
public record ListEfficiencyPoliciesQuery : ICommand<IEnumerable<EfficiencyPolicyDTO>>
{
}