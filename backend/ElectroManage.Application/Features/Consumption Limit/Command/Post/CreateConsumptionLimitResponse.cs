namespace ElectroManage.Application.Features.ConsumptionLimit.Command.Post;
public record CreateConsumptionLimitResponse
{
    public long Id {get;set;}
    public decimal Limit {get; set; }
    public long CompanyId {get; set; }
    public string CompanyName {get; set; } = string.Empty;
    public DateTime Created {get;set;}

}