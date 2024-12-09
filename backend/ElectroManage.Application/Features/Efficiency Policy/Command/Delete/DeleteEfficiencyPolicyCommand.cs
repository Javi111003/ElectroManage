using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.Efficiency_Policy.Command.Delete;

public record DeleteEfficiencyPolicyCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
