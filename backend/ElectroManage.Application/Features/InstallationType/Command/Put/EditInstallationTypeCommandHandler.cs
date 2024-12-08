
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.InstallationType.Command.Put;

public class EditInstallationTypeCommandHandler : CoreCommandHandler<EditInstallationTypeCommand, EditInstallationTypeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditInstallationTypeCommandHandler> _logger;

    public EditInstallationTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<EditInstallationTypeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<EditInstallationTypeResponse> ExecuteAsync(EditInstallationTypeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var installationTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.InstalationType>();
        var filter = new Expression<Func<Domain.Entites.Sucursal.InstalationType, bool>>[]
        {
            x => x.Id == command.Id,
        };
        var installationType = await installationTypeRepository.FirstAsync(useInactive: true, filters: filter);
        if (installationType is null)
        {
            _logger.LogError($"Installation with id: {command.Id} not found");
            ThrowError($"Installation with id: {command.Id} not found", 404);
        }
        var checkUniqueName = await installationTypeRepository.CountAsync(useInactive: true, filters: x=> x.Name == command.Name && x.Id != command.Id);
        if (checkUniqueName > 0)
        {
            _logger.LogError($"Exist almost one Installation Type with this name");
            ThrowError($"Installation with id: {command.Id} not found", 404);
        }
        installationType.Name = command.Name;
        installationType.Description = command.Description;
        await installationTypeRepository.UpdateAsync(installationType);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new EditInstallationTypeResponse
        {
            Id = installationType.Id,
            Name = installationType.Name,
            Description = installationType.Description
        };
    }
}
