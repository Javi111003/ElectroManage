using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.Office;

public record OfficeResponse
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public CompanyResponse Company { get; set; } = null!;
}
