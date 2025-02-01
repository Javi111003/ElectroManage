namespace ElectroManage.Application.Features.Company.Query.Export.Proyection;
public class ExportProyectionCommand : ICommand<byte[]>
{
    public long UserId { get; set; }
    public IEnumerable<long> CompaniesId { get; set; } = new HashSet<long>();
    public string Format { get; set; } = "pdf";
}