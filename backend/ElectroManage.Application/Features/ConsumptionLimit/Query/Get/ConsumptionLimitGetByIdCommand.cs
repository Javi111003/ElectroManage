namespace ElectroManage.Application.Features.ConsumptionLimit.Query.Get;

public record ConsumptionLimitGetByIdCommand : ICommand<ConsumptionLimitGetByIdResponse>
{
    public long Id { get; set; }
}