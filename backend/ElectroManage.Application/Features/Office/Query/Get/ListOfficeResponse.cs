using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Office.Query.Get;

public record ListOfficeResponse
{
    public ICollection<OfficeDTO> Offices { get; set; } = [];
}
