namespace ElectroManage.Application.DTO_s;
public record OfficeDTO
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public CompanyDTO Company { get; set; } = null!;
}