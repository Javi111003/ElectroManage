using System;
namespace ElectroManage.Application.Features.Warning.Query.Export.List;
public class ExportWarningsByCompanyCommand : ICommand<byte[]>
{
    public long CompanyId { get; set; }
    public long UserId { get; set; }
    public string Format { get; set; } = "pdf";
}