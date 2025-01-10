namespace ElectroManage.Application.DTO_s;

public record AppliedEfficiencyPolicyDTO
{
    public EfficiencyPolicyDTO EfficiencyPolicy { get; set;} = null!;
    public DateTime ApplyingDate {get; set;}
    public DateTime To { get ; set;}
}
