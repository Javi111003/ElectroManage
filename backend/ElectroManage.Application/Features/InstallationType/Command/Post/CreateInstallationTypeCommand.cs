namespace ElectroManage.Application.Features.InstallationType.Command.Post;

public record CreateInstallationTypeCommand : ICommand<CreateInstallationTypeResponse>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
