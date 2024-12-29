namespace ElectroManage.Application.Features.InstallationType.Query.Get;

public record InstallationTypeGetByIdResponse
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
}
