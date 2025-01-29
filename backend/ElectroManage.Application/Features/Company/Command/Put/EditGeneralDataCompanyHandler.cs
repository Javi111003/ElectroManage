using ElectroManage.Application.DTO_s;
using ElectroManage.Application.Mappers;
using ElectroManage.Domain.DataAccess.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Command.Put;

public class EditGeneralDataCompanyHandler : CoreCommandHandler<EditGeneralDataCompanyCommand, CompanyResponse>
{
    readonly IUnitOfWork _unitOfWork;
    readonly ILogger<EditGeneralDataCompanyHandler> _logger;

    public EditGeneralDataCompanyHandler(IUnitOfWork unitOfWork, ILogger<EditGeneralDataCompanyHandler> logger) : base(unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task<CompanyResponse> ExecuteAsync(EditGeneralDataCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var companyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.Company>();
        
        var company = await companyRepository.GetAll(useInactive: true, filters: x => x.Id == command.Id)
            .Include(x => x.AministrativeArea)
            .Include(x => x.InstalationType)
            .Include(x => x.Location)
            .Include(x => x.CostFormulas)
            .Include(x => x.EfficiencyPoliciesApplyed)
            .ThenInclude(x => x.EfficiencyPolicy)
        .FirstOrDefaultAsync();
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
        var installationTypeRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.InstalationType>();
        var installationType = await installationTypeRepository.FirstAsync(true, filters: x => x.Id == command.InstallationTypeId);
        if (installationType is null)
        {
            _logger.LogError($"Installation type with id: {command.InstallationTypeId} not found");
            ThrowError($"Installation type with id: {command.InstallationTypeId} not found", 404);
        }
        var managementTeamRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.ManagementTeam>();
        var managementTeam = await managementTeamRepository.FirstAsync(useInactive: true, filters: x => x.Id == command.ManagementTeamId);
        if (managementTeam is null && command.ManagementTeamId > 0)
        {
            _logger.LogError($"Management Team with id: {command.ManagementTeamId} not found");
            ThrowError($"Management Team with id: {command.ManagementTeamId} not found", 404);
        }
        if(managementTeam is not null)
        {
            company.ManagementTeam = managementTeam;
        }
        var efficiencyPolicyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        var efficiencyPolicy = await efficiencyPolicyRepository.FirstAsync(true, filters: x => x.Id == command.EfficiencyPolicyId);
        if (command.EfficiencyPolicyId > 0)
        {
            if (efficiencyPolicy is null)
            {
                _logger.LogError($"Efficiency policy with id: {command.EfficiencyPolicyId} not found");
                ThrowError($"Efficiency policy with id: {command.EfficiencyPolicyId} not found", 404);
            }
        }
        var efficiencyPolicyCompanyRepository = _unitOfWork.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicyCompany>();

        using (var scopeDoWork = ScopeBeginTransactionAsync())
        {
            company.Name = command.Name;
            company.ConsumptionLimit = command.ConsumptionLimit;
            company.AministrativeAreaId = command.AreaId;
            company.AministrativeArea = area;
            company.InstalationTypeId = command.InstallationTypeId;
            company.InstalationType = installationType;
            company.LocationId = command.LocationId;
            company.Location = location;
    
            var lastPolicy = company.EfficiencyPoliciesApplyed.Where(p => p.StatusBaseEntity == Domain.Enums.StatusEntityType.Active).Count() > 0 ? company.EfficiencyPoliciesApplyed.Where(p => p.StatusBaseEntity == Domain.Enums.StatusEntityType.Active).Last() : null; 
            if(lastPolicy is not null && (efficiencyPolicy is not null && lastPolicy.EfficiencyPolicyId != efficiencyPolicy.Id || efficiencyPolicy is null))
            {
                lastPolicy.To = command.PolicyApplyingDate;
                lastPolicy.StatusBaseEntity = Domain.Enums.StatusEntityType.Inactive;
                await efficiencyPolicyCompanyRepository.UpdateAsync(lastPolicy, false);
            }
            if(efficiencyPolicy is not null && (lastPolicy is null || lastPolicy.EfficiencyPolicyId != efficiencyPolicy.Id))
            {
                var newPolicy = new Domain.Entites.Sucursal.EfficiencyPolicyCompany
                {
                    CompanyId = company.Id,
                    EfficiencyPolicyId = command.EfficiencyPolicyId,
                    ApplyingDate = command.PolicyApplyingDate ?? DateTime.Now,
                };
                company.EfficiencyPoliciesApplyed.Add(newPolicy);
                efficiencyPolicy.EfficiencyPolicyCompanies.Add(newPolicy);
                await efficiencyPolicyCompanyRepository.SaveAsync(newPolicy, false);
                await efficiencyPolicyRepository.UpdateAsync(efficiencyPolicy, false);
            }
            await companyRepository.UpdateAsync(company, false);
            CommitTransaction(scopeDoWork);
        }
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution Completed");
        return CompanyMapper.ToResponse(company);
    }
}