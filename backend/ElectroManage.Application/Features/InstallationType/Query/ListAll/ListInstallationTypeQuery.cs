using ElectroManage.Application.DTO_s;

namespace ElectroManage.Application.Features.InstallationType.Query.ListAll;
public record ListInstallationTypeQuery : ICommand<IEnumerable<InstallationTypeDTO>>
{
}