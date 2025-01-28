using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.CompareEfficiencyPolicyEffect;

public record CompareEfficiencyPolicyEffectResponse
{
    public ListRegisterByCompanyResponse Before {get; set;} = null!;
    public ListRegisterByCompanyResponse After {get; set;} = null!;
}