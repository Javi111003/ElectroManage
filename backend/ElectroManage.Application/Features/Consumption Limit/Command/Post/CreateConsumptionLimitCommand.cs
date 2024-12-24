namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Post;
public record CreateConsumptionLimitCommand : ICommand<CreateConsumptionLimitResponse>
{
    public decimal Limit {get; set; }
    public long CompanyId {get; set; }
}