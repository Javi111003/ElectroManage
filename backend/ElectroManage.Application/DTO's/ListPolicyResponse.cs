namespace ElectroManage.Application.DTO_s;
public record ListPolicyResponse
{
    public long Id {get;set;}
    public string Name { get; set; } = string.Empty;
    public DateTime ApplyingDate {get;set;}
    public long CompanyId { get; set; }
}