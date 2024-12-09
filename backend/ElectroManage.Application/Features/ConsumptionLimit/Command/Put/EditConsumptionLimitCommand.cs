namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Put;
public record EditConsumptionLimitCommand : ICommand<EditConsumptionLimitResponse>
{
    public long Id {get;set;}
    public decimal Limit {get;set;}
}