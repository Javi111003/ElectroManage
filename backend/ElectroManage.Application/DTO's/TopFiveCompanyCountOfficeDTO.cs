namespace ElectroManage.Application.DTO_s;

public record TopFiveCompanyCountOfficeDTO
{
    public long CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public long OfficeCount { get; set; }
}