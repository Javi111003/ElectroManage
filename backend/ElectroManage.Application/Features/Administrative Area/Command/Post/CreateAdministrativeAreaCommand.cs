namespace ElectroManage.Application.Features.Administrative_Area.Command.Post;

public record CreateAdministrativeAreaCommand : ICommand<CreateAdministrativeAreaResponse>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Created {  get; set; }
}
