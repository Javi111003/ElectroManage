using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Location.Query.Get;
public record LocationGetByIdResponse
{
    public string? AddressDetails { get; set; }
    public CoordenateDTO Coordenate { get; set; } = null!;
}