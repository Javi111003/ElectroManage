namespace ElectroManage.Application.Features.InstallationType.Command.Post;

public record CreateInstallationTypeCommand : ICommand<CreateInstallationTypeResponse>
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}
