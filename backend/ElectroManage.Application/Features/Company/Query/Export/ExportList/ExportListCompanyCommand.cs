namespace ElectroManage.Application.Features.Company.Query.Export.List;
public class ExportListCompanyCommand : ICommand<byte[]>
{
    public long UserId { get; set; }
    public string Format { get; set; } = "pdf";
}