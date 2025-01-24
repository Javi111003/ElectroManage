using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Command.Post;

public class CreateCompanyCommandHandler : CoreCommandHandler<CreateCompanyCommand, CompanyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<CreateCompanyCommandHandler> _logger;

    public CreateCompanyCommandHandler(IUnitOfWork unitOfWork, ILogger<CreateCompanyCommandHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CompanyResponse> ExecuteAsync(CreateCompanyCommand command, CancellationToken ct = default)
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

        var managementTeamRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.ManagementTeam>();
        var managementTeam = await managementTeamRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.ManagementTeamId);
        if (managementTeam is null && command.ManagementTeamId > 0)
        {
            _logger.LogError($"Management Team with id: {command.ManagementTeamId} not found");
            ThrowError($"Management Team with id: {command.ManagementTeamId} not found", 404);
        }

        var efficiencyPolicyRepository =  _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        var efficiencyPolicy = await efficiencyPolicyRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.EfficiencyPolicyId);
        if (efficiencyPolicy is null && command.EfficiencyPolicyId > 0)
        {
            _logger.LogError($"Efficiency Policy with id: {command.EfficiencyPolicyId} not found");
            ThrowError($"Efficiency Policy with id: {command.EfficiencyPolicyId} not found", 404);
        }
        var efficiencyPolicyCompanyRepository =  _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicyCompany>();

        
        var company = new Domain.Entites.Sucursal.Company
        {
            Name = command.Name,
            InstalationType = installationType,
            AministrativeArea = administrativeArea,
            Location = location,
            ManagementTeam = managementTeam,
            ConsumptionLimit = command.ConsumptionLimit
        };
        
        using (var scopeDoWork = ScopeBeginTransactionAsync())
        {
            await companyRepository.SaveAsync(company);

            if(efficiencyPolicy is not null)
            {
                var efficiencyPolicyCompany = new Domain.Entites.Sucursal.EfficiencyPolicyCompany
                {
                    EfficiencyPolicyId = efficiencyPolicy.Id,
                    CompanyId = company.Id,
                    ApplyingDate = command.PolicyApplyingDate
                };
                await efficiencyPolicyCompanyRepository.SaveAsync(efficiencyPolicyCompany, false);

                company.EfficiencyPoliciesApplyed.Add(efficiencyPolicyCompany);
                efficiencyPolicy.EfficiencyPolicyCompanies.Add(efficiencyPolicyCompany);

                await efficiencyPolicyRepository.UpdateAsync(efficiencyPolicy, false);
                await companyRepository.UpdateAsync(company,false);
            }
            CommitTransaction(scopeDoWork);
        }
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return CompanyMapper.ToResponse(company);
    }
}
