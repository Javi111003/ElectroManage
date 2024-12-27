
using ElectroManage.Application.DTO_s;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.InstallationType.Query.Get;

public class ListInstallationTypeCommandHandler : CoreCommandHandler<ListInstallationTypeCommand, ListInstallationTypeResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<ListInstallationTypeCommandHandler> _logger;

    public ListInstallationTypeCommandHandler(IUnitOfWork unitOfWork, ILogger<ListInstallationTypeCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<ListInstallationTypeResponse> ExecuteAsync(ListInstallationTypeCommand command, CancellationToken ct = default)
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
        return new ListInstallationTypeResponse
        {
            InstallationTypes = installationTypes,
        };
    }
}
