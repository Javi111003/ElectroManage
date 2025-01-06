using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mappers;
public static class EfficiencyPolicyMapper
{
    public static EfficiencyPolicyDTO MapToEfficiencyPolicyCompanyDTO(Domain.Entites.Sucursal.EfficiencyPolicyCompany policy)
    {
        var response = new EfficiencyPolicyDTO
        {
            PolicyId = policy.EfficiencyPolicyId,
            PolicyName = policy.EfficiencyPolicy.Name,
            Description = policy.EfficiencyPolicy.Description,
            ApplyingDate = policy.ApplyingDate
        };
        return response;
    }
    public static EfficiencyPolicyDTO MapToEfficiencyPolicyDTO(Domain.Entites.Sucursal.EfficiencyPolicy policy)
    {
        var response = new EfficiencyPolicyDTO
        {
            PolicyId = policy.Id,
            PolicyName = policy.Name,
            Description = policy.Description
        };
        return response;
    }
}