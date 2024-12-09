using ElectroManage.Common.Dtos;

namespace ElectroManage.Application.Features.InstallationType.Command.Delete;

public record DeleteInstallationTypeCommand : ICommand<Response<NoContentData>>
{
    public long Id { get; set; }
}
