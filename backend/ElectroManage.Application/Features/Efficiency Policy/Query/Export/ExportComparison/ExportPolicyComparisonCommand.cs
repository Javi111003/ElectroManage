using System;
namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Export.Comparison;
public class ExportPolicyComparisonCommand : ICommand<byte[]>
{
    public long UserId { get; set; }
    public long CompanyId { get; set; }
    public long PolicyId { get; set; }
    public DateTime ApplyingDate {get; set;}
    public string Format { get; set; } = "pdf";
}