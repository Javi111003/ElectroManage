
using ElectroManage.Application.Abstractions;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.InstallationType.Command.Post;

public class CreateInstallationTypeCommandHandler : CoreCommandHandler<CreateInstallationTypeCommand, CreateInstallationTypeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateInstallationTypeCommandHandler> _logger;
    readonly ICheckUniqueService _checkUniqueService;
    public CreateInstallationTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateInstallationTypeCommandHandler> logger, ICheckUniqueService checkUniqueService) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _checkUniqueService = checkUniqueService;
    }

    public async override Task<CreateInstallationTypeResponse> ExecuteAsync(CreateInstallationTypeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var insatallationTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.InstalationType>();

        var installationType = new Domain.Entites.Sucursal.InstalationType
        {
            Name = command.Name,
            Description = command.Description,
        };
        var checkUniqueName = await _checkUniqueService.CheckUniqueNameAsync(installationType);
        if (!checkUniqueName)
        {
            _logger.LogError("Exist almost one installation type with this name");
            ThrowError("Exist almost one installation type with this name", 400);
        }
        await insatallationTypeRepository.SaveAsync(installationType);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new CreateInstallationTypeResponse
        {
            Id = installationType.Id,
            Name = installationType.Name,
            Description = installationType.Description,
        };
    }
}
