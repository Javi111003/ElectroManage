using System;
namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Export.List;
public class ExportListPoliciesCommand : ICommand<byte[]>
{
    public long UserId { get; set; }
    public string Format { get; set; } = "pdf";
}