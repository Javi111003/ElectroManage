namespace ElectroManage.Application.Features.Office.Query.Get;

public record OfficeGetByIdCommand : ICommand<OfficeResponse>
{
    public long Id { get; set; }
}
