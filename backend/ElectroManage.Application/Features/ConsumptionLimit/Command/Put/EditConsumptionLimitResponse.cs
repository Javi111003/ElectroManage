namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Put;

public record EditConsumptionLimitResponse
{
    public long Id {get;set;}
    public decimal Limit{get;set;}
}