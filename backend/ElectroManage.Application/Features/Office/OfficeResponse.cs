namespace ElectroManage.Application.Features.Office;

public record OfficeResponse
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public CompanyDTO Company { get; set; } = null!;
}

public class CompanyDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
