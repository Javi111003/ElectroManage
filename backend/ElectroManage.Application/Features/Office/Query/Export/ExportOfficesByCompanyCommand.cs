using System;
namespace ElectroManage.Application.Features.Office.Query.Export.List;
public class ExportOfficesByCompanyCommand : ICommand<byte[]>
{
    public long UserId { get; set; }
    public long CompanyId { get; set; }
    public string Format { get; set; } = "pdf";
}