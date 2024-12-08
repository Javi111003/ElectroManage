namespace ElectroManage.Application.Features.InstallationType.Query.Get;

public record InstallationTypeGetByIdCommand : ICommand<InstallationTypeGetByIdResponse>
{
    public long Id { get; set; }
}
