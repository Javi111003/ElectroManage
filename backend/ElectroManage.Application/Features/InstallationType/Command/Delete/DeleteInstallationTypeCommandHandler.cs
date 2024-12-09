using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.InstallationType.Command.Delete;

public class DeleteInstallationTypeCommandHandler : CoreCommandHandler<DeleteInstallationTypeCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteInstallationTypeCommandHandler> _logger;

    public DeleteInstallationTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteInstallationTypeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteInstallationTypeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var installationTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.InstalationType>();
        var installationType = await installationTypeRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if (installationType is null)
        {
            _logger.LogError($"Installation Type with id: {command.Id} not found");
            ThrowError($"Installation Type with id: {command.Id} not found", 404);
        }
        installationType.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await installationTypeRepository.UpdateAsync(installationType);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}
