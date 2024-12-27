using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.InstallationType.Query.Get;

public record ListInstallationTypeResponse
{
    public ICollection<InstallationTypeDTO> InstallationTypes { get; set; } = [];
}
