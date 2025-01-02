namespace ElectroManage.Application.DTO_s;
public record ListWarningsByCompanyResponse
{
    public long CompanyID { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public IEnumerable<WarningDTO> Warnings { get; set; } = new HashSet<WarningDTO>();
}