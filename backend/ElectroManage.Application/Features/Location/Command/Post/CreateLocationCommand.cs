using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Location.Command.Post;
public record CreateLocationCommand : ICommand<CreateLocationResponse>
{
    public string? AddressDetails { get; set; } 
    public CoordenateDTO Coordenate { get; set; } = null!;
}