namespace ElectroManage.Application.Features.Warning.Query.Get;

public record WarningGetByIdCommand : ICommand<WarningGetByIdResponse>
{
    public required long Id { get; set; }
}
