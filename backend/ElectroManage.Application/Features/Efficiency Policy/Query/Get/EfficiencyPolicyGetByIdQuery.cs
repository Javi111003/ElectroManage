using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Get;

public record EfficiencyPolicyGetByIdQuery : ICommand<EfficiencyPolicyDTO>
{
    public long Id { get; set; }
}
