namespace ElectroManage.Application.DTO_s;
public record EfficiencyPolicyDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime ApplyingDate { get; set; }
}