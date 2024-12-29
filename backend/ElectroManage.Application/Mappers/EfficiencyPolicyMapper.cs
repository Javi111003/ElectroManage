using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Mappers;
public static class EfficiencyPolicyMapper
{
    public static EfficiencyPolicyDTO MapToEfficiencyPolicyDTO(Domain.Entites.Sucursal.EfficiencyPolicy policy)
    {
        var response = new EfficiencyPolicyDTO
        {
            Id = policy.Id,
            Name = policy.Name,
            Description = policy.Description,
            ApplyingDate = policy.ApplyingDate
        };
        return response;
    }
}