namespace ElectroManage.Application.Features.ConsumptionLimit.Query.Get;

public record ConsumptionLimitGetByIdResponse
{
    public long Id { get; set; }
    public decimal Limit{get;set;}
    public DateTime Created { get; set; }
    public string Status { get; set; } = string.Empty;
}
