namespace ElectroManage.Application.DTO_s;

public record CountWarningByMonthDTO
{
    public int Month { get; set; }
    public int CountWarnings { get; set; }
}
