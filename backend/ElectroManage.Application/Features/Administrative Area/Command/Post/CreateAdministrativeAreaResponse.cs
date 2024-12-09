namespace ElectroManage.Application.Features.Administrative_Area.Command.Post;

public record CreateAdministrativeAreaResponse 
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime Created { get; set; }
}