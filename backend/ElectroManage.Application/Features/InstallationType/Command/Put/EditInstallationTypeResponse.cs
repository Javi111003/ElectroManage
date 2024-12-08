namespace ElectroManage.Application.Features.InstallationType.Command.Put;

public record EditInstallationTypeResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
