namespace ElectroManage.Application.Features.InstallationType.Command.Put;

public record EditInstallationTypeCommand : ICommand<EditInstallationTypeResponse>
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
