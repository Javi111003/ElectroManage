namespace ElectroManage.Application.DTO_s;

public record TopFiveCompaniesCountWarningDTO
{
    public long CompanyId { get; set; }
    public long CountWarning { get; set; }
}
