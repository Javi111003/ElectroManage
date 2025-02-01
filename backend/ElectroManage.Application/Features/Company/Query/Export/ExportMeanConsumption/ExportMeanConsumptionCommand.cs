namespace ElectroManage.Application.Features.Company.Query.Export.MeanCost;
public class ExportMeanCostCommand : ICommand<byte[]>
{
    public long UserId { get; set; }
    public IEnumerable<long> CompanyIds { get; set; } = new HashSet<long>();
    public string Format { get; set; } = "pdf";
}