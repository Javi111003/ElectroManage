namespace ElectroManage.Application.Features.Register.Query.Export.List;
public class ExportRegistersByCompanyCommand : ICommand<byte[]>
{
    public long UserId { get; set; }
    public long CompanyId { get; set; }
    public DateTime Start {  get; set; }
    public DateTime End { get; set; }
    public string Format { get; set; } = "pdf";
}