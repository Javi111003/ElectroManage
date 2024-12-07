using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Features.Location.Command.Post;

namespace ElectroManage.Application.Features.Location.Query.Get;

public record LocationGetByIdResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public long ZipCode { get; set; }
    public string Description { get; set; } = string.Empty;
    public CoordenateDTO Coordenate { get; set; } = null!;
    public AddressDTO Address { get; set; } = null!;
}
