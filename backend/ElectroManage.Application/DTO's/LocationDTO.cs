namespace ElectroManage.Application.DTO_s;
public record LocationDTO
{
    public string Name { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
}