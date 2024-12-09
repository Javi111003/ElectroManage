namespace ElectroManage.Application.Features.Office.Command.Post;

public record CreateOfficeCommand : ICommand<OfficeResponse>
{
    public long CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
