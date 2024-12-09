
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Command.Put;

public class EditGeneralDataCompanyHandler : CoreCommandHandler<EditGeneralDataCompanyCommand, EditGeneralDataCompanyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditGeneralDataCompanyHandler> _logger;

    public EditGeneralDataCompanyHandler(IUnitOfWork unitOfWork, ILogger<EditGeneralDataCompanyHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<EditGeneralDataCompanyResponse> ExecuteAsync(EditGeneralDataCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.AministrativeArea,
            x => x.InstalationType,
            x => x.Location,
        };
        var company = await companyRepository.FirstAsync(useInactive: true, includes: include, filters: x => x.Id == command.Id);
        if (company is null)
        {
            _logger.LogError($"Company with id: {command.Id} not found");
            ThrowError($"Company with id: {command.Id} not found", 400);
        }
        var administrativeAreaRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.AministrativeArea>();
        var area = await administrativeAreaRepository.FirstAsync(true, filters: x => x.Id == command.AreaId);
        if (area is null)
        {
            _logger.LogError($"Administrative Area with id: {command.AreaId} not found");
            ThrowError($"Administrative Area with id: {command.AreaId} not found", 404);
        }
        var locationRepository = _unitOfWork.DbRepository<Domain.Entites.Location>();
        var location = await locationRepository.FirstAsync(true, filters: x => x.Id == command.LocationId);
        if (location is null)
        {
            _logger.LogError($"Location with id: {command.LocationId} not found");
            ThrowError($"Location with id: {command.LocationId} not found", 404);
        }
        var installationTypeReporitory = _unitOfWork.DbRepository<Domain.Entites.Sucursal.InstalationType>();
        var installationType = await installationTypeReporitory.FirstAsync(true, filters: x => x.Id == command.InstallationTypeId);
        if (installationType is null)
        {
            _logger.LogError($"Installation type with id: {command.InstallationTypeId} not found");
            ThrowError($"Installation type with id: {command.InstallationTypeId} not found", 404);
        }

        company.Name = command.Name;
        company.AministrativeAreaId = command.AreaId;
        company.AministrativeArea = area;
        company.InstalationTypeId = command.InstallationTypeId;
        company.InstalationType = installationType;
        company.LocationId = command.LocationId;
        company.Location = location;

        await companyRepository.UpdateAsync(company);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return new EditGeneralDataCompanyResponse
        {
            Name = company.Name,
            Area = company.AministrativeArea.Name,
            Installation = company.InstalationType.Name,
            Location = company.Location.Name
        };
    }
}
