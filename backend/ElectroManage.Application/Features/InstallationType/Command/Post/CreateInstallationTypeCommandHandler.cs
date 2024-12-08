
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.InstallationType.Command.Post;

public class CreateInstallationTypeCommandHandler : CoreCommandHandler<CreateInstallationTypeCommand, CreateInstallationTypeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateInstallationTypeCommandHandler> _logger;

    public CreateInstallationTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateInstallationTypeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<CreateInstallationTypeResponse> ExecuteAsync(CreateInstallationTypeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var insatallationTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.InstalationType>();
        var checkUniqueName = await insatallationTypeRepository.CountAsync(useInactive: true, filters: x => x.Name == command.Name);
        if (checkUniqueName > 0)
        {
            _logger.LogError("Exist almost one installation type with this name");
            ThrowError("Exist almost one installation type with this name", 400);
        }
        var installationType = new Domain.Entites.Sucursal.InstalationType
        {
            Name = command.Name,
            Description = command.Description,
        };
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
