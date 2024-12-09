namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Get;

public record EfficiencyPolicyGetByIdResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime Created { get; set; }
    public DateTime ApplyingDate { get; set; }
}
