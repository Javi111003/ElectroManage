
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.Get;

public class CompanyGetByIdCommandHandler : CoreCommandHandler<CompanyGetByIdCommand, CompanyGetByIdResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CompanyGetByIdCommandHandler> _logger;

    public CompanyGetByIdCommandHandler(IUnitOfWork unitOfWork, ILogger<CompanyGetByIdCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CompanyGetByIdResponse> ExecuteAsync(CompanyGetByIdCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.AministrativeArea,
            x => x.Location,
            x => x.InstalationType,
        };
        var company = await companyRepository.FirstAsync(useInactive: true, includes: include, filters: x => x.Id == command.Id);
        if (company is null)
        {
            _logger.LogInformation($"Company with id: {command.Id} not found");
            ThrowError($"Company with id: {command.Id} not found", 404);
        }
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return new CompanyGetByIdResponse
        {
            Id = command.Id,
            Name = company.Name,
            InstallationType = new InstallationTypeDTO
            {
                Name = company.InstalationType.Name,
                Description = company.InstalationType.Description,
            },
            AdministrativeArea = new AdministrativeAreaDTO
            {
                Name = company.AministrativeArea.Name,
                Description = company.AministrativeArea.Description,
            },
            Location = new LocationDTO
            {
                Name = company.Location.Name,
                Street = company.Location.Street,
                Description = company.Location.Description
            },
            Status = company.StatusBaseEntity.ToString(),
        };
    }
}
