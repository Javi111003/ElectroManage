namespace ElectroManage.Application.DTO_s;

public record InstallationTypeDTO
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
}