using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.ListEfficiencyPoliciesByCompany;
public record ListEfficiencyPoliciesByCompanyQuery : ICommand<IEnumerable<AppliedEfficiencyPolicyDTO>>
{
    public long CompanyId { get; set; }
}