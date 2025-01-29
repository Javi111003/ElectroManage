using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mappers;
public static class EfficiencyPolicyMapper
{
    public static EfficiencyPolicyDTO MapToEfficiencyPolicyDTO(Domain.Entites.Sucursal.EfficiencyPolicy policy)
    {
        return new EfficiencyPolicyDTO
        {
            PolicyId = policy.Id,
            PolicyName = policy.Name,
            Description = policy.Description
        };
    }
    public static AppliedEfficiencyPolicyDTO MapToAppliedEfficiencyPolicyDTO(Domain.Entites.Sucursal.EfficiencyPolicyCompany appliedPolicy)
    {
        return new AppliedEfficiencyPolicyDTO
        {
            EfficiencyPolicy = MapToEfficiencyPolicyDTO(appliedPolicy.EfficiencyPolicy),
            ApplyingDate = appliedPolicy.ApplyingDate,
            To = appliedPolicy.To,
        };
    }
}