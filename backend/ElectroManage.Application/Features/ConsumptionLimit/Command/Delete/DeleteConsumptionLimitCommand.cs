using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Delete;

public record DeleteConsumptionLimitCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
