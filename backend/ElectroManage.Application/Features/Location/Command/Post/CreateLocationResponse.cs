using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Location.Command.Post;

public record CreateLocationResponse
{
    public long Id { get; set; }
    public string? AddressDetails { get; set; } 
    public CoordenateDTO Coordenate { get; set; } = null!;
}