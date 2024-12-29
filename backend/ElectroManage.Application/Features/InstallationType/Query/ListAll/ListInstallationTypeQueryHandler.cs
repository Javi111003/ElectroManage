using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.InstallationType.Query.ListAll;

public class ListInstallationTypeQueryHandler : CoreQueryHandler<ListInstallationTypeQuery, IEnumerable<InstallationTypeDTO>>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListInstallationTypeQueryHandler> _logger;

    public ListInstallationTypeQueryHandler(IUnitOfWork unitOfWork, ILogger<ListInstallationTypeQueryHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<IEnumerable<InstallationTypeDTO>> ExecuteAsync(ListInstallationTypeQuery command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var installationTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.InstalationType>();
        var installationTypes = (await installationTypeRepository.GetAll(useInactive: true).ToListAsync())
            .Select(x => new InstallationTypeDTO
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
            }).ToList();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return installationTypes;
    }
}