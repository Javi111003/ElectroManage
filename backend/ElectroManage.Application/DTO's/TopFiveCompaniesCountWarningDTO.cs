namespace ElectroManage.Application.DTO_s;

public record TopFiveCompaniesCountWarningDTO
{
    public CompanyDTO Company { get; set; } = null!;
    public long CountWarning { get; set; }
}
