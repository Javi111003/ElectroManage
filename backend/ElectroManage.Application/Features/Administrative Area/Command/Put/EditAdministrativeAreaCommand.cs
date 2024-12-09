namespace ElectroManage.Application.Features.Administrative_Area.Command.Put;

public record EditAdministrativeAreaCommand : ICommand<EditAdministrativeAreaResponse>
{
    public long Id { get; set; }
    public required string Name { get; set; } 
    public string? Description { get; set; }
}
