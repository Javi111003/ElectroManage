namespace ElectroManage.Application.Features.InstallationType.Command.Put;

public record EditInstallationTypeCommand : ICommand<EditInstallationTypeResponse>
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}
