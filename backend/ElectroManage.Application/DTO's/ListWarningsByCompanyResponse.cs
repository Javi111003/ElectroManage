namespace ElectroManage.Application.DTO_s;
public record ListWarningsByCompanyResponse
{
    public long CompanyID { get; set; }
    public ICollection<WarningDTO> Warnings { get; set; } = [];
}