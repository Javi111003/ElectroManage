using ElectroManage.Application.Features.InstallationType.Command.Delete;
using ElectroManage.Common.Dtos;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Warning.Command.Delete;

public class DeleteWarningCommandHandler : CoreCommandHandler<DeleteWarningCommand, Response<NoContentData>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<DeleteInstallationTypeCommandHandler> _logger;

    public DeleteWarningCommandHandler(IUnitOfWork unitOfWork, ILogger<DeleteInstallationTypeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<Response<NoContentData>> ExecuteAsync(DeleteWarningCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var warningRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Warning>();
        var warning = await warningRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.Id);
        if (warning is null)
        {
            _logger.LogError($"Warning with id: {command.Id} not found");
            ThrowError($"Warning with id: {command.Id} not found", 404);
        }
        warning.StatusBaseEntity = Domain.Enums.StatusEntityType.Delete;
        await warningRepository.UpdateAsync(warning, false);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return Response<NoContentData>.SuccessWithOutData("OK");
    }
}
