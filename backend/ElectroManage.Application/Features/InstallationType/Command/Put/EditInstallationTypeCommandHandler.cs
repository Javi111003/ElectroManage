using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.InstallationType.Command.Put;

public class EditInstallationTypeCommandHandler : CoreCommandHandler<EditInstallationTypeCommand, EditInstallationTypeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditInstallationTypeCommandHandler> _logger;
    readonly ICheckUniqueService _checkUniqueService; 
    public EditInstallationTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<EditInstallationTypeCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _checkUniqueService = checkUniqueService;
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
        using (var scope = ScopeBeginTransactionAsync())
        {
            installationType.Name = command.Name;
            installationType.Description = command.Description;
            var checkUniqueName = await _checkUniqueService.CheckUniqueNameAsync(installationType);
            if (!checkUniqueName)
            {
                _logger.LogError($"Exist almost one Installation Type with this name");
                ThrowError($"Installation with id: {command.Id} not found", 404);
            }
            await installationTypeRepository.UpdateAsync(installationType);
            CommitTransaction(scope);
        }
        await UnitOfWork!.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new EditInstallationTypeResponse
        {
            Id = installationType.Id,
            Name = installationType.Name,
            Description = installationType.Description
        };
    }
}