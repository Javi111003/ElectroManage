
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Command.Post;

public class CreateCompanyCommandHandler : CoreCommandHandler<CreateCompanyCommand, CreateCompanyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateCompanyCommandHandler> _logger;

    public CreateCompanyCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateCompanyCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CreateCompanyResponse> ExecuteAsync(CreateCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();

        var locationRepository = _unitOfWork.DbRepository<Domain.Entites.Location>();
        var location = await locationRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.LocationId);
        if (location is null)
        {
            _logger.LogError($"Location with id: {command.LocationId} not found");
            ThrowError($"Location with id: {command.LocationId} not found", 404);
        }

        var installationTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.InstalationType>();
        var installationType = await installationTypeRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.InstallationTypeId);
        if (installationType is null)
        {
            _logger.LogError($"Installation Type with id: {command.InstallationTypeId} not found");
            ThrowError($"Installation Type with id: {command.InstallationTypeId} not found", 404);
        }

        var administrativeAreaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.AministrativeArea>();
        var administrativeArea = await administrativeAreaRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.AreaId);
        if (administrativeArea is null)
        {
            _logger.LogError($"Administrative Area with id: {command.AreaId} not found");
            ThrowError($"Administrative Area with id: {command.AreaId} not found", 404);
        }

        var company = new Domain.Entites.Sucursal.Company
        {
            Name = command.Name,
            InstalationTypeId = installationType.Id,
            InstalationType = installationType,
            AministrativeAreaId = administrativeArea.Id,
            AministrativeArea = administrativeArea,
            LocationId = location.Id,
            Location = location,
        };
        await companyRepository.SaveAsync(company);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new CreateCompanyResponse
        {
            Id = company.Id,
            Name = company.Name,
            InstallationType = company.InstalationType.Name,
            Description = company.InstalationType.Description,
            Area = company.AministrativeArea.Name,
        };
    }
}
