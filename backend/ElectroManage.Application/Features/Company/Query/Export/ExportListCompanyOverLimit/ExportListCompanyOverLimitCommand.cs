namespace ElectroManage.Application.Features.Company.Query.Export.ListCompanyOverLimit;
public class ExportListCompanyOverLimitCommand : ICommand<byte[]>
{
    public long UserId { get; set; }
    public DateTime Date { get; set; }
    public string Format { get; set; } = "pdf";
}