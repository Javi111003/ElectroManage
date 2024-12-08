namespace ElectroManage.Application.Features.InstallationType.Command.Post;

public record CreateInstallationTypeResponse
{
    public long Id { get; set; } 
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
