using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Administrative_Area.Query.Get;

public record ListAdministrativeAreaResponse
{
    public ICollection<AdministrativeAreaDTO> Response { get; set; } = [];
}
