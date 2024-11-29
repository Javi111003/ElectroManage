namespace ElectroManage.Application.DTO_s;
public record ListOfficeResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public long CompanyId { get; set; }
}