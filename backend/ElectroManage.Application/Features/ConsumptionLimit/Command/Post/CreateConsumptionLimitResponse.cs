namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Post;

public record CreateConsumptionLimitResponse
{
    public long Id {get;set;}
    public decimal Limit{get;set;}
    public DateTime Created{get;set;}
}