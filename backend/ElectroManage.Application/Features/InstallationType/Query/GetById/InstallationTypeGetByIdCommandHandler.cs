
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.InstallationType.Query.Get;

public class InstallationTypeGetByIdCommandHandler : CoreCommandHandler<InstallationTypeGetByIdCommand, InstallationTypeGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<InstallationTypeGetByIdCommandHandler> _logger;

    public InstallationTypeGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<InstallationTypeGetByIdCommandHandler> logger) : base(unitOfWork)  
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async override Task<InstallationTypeGetByIdResponse> ExecuteAsync(InstallationTypeGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var installationTypeReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.InstalationType>();
        var filter = new Expression<Func<Domain.Entites.Sucursal.InstalationType, bool>>[]
        {
            x => x.Id == command.Id,
        };
        var installationType = await installationTypeReporitory.FirstAsync(useInactive: true, filters: filter);
        if (installationType is null)
        {
            _logger.LogError($"Installation type with id: {command.Id} not found");
            ThrowError($"Installation type with id: {command.Id} not found", 404);
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new InstallationTypeGetByIdResponse
        {
            Name = installationType.Name,
            Description = installationType.Description,
        };
    }
}
