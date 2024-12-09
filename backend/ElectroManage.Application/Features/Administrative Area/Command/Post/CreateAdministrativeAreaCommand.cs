namespace ElectroManage.Application.Features.Administrative_Area.Command.Post;

public record CreateAdministrativeAreaCommand : ICommand<CreateAdministrativeAreaResponse>
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}
