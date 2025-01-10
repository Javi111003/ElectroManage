namespace ElectroManage.Application.DTO_s;
public record EfficiencyPolicyDTO
{
    public long PolicyId { get; set; }
    public string PolicyName { get; set; } = string.Empty;
    public string? Description { get; set; }
}