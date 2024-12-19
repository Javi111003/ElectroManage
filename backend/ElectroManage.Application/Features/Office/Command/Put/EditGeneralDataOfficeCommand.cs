namespace ElectroManage.Application.Features.Office.Command.Put;

public class EditGeneralDataOfficeCommand : ICommand<OfficeResponse>
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long CompanyId { get; set; }
}
