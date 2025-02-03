using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Plugins;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Export.Comparison;
public class ExportPolicyComparisonCommandHandler : CoreQueryHandler<ExportPolicyComparisonCommand, byte[]>
{
    readonly ILogger<ExportPolicyComparisonCommandHandler> _logger;
    readonly ITemplateService _templateService;
    readonly PluginLoader _pluginLoader;
    public ExportPolicyComparisonCommandHandler(
        ILogger<ExportPolicyComparisonCommandHandler> logger, 
        ITemplateService templateService, 
        PluginLoader pluginLoader,
        IUnitOfWork unitOfWork) : base(unitOfWork)

    {
        _logger = logger;
        _templateService = templateService;
        _pluginLoader = pluginLoader;
    }
    public override async Task<byte[]> ExecuteAsync(ExportPolicyComparisonCommand command, CancellationToken ct = default)

    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepo = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();
        var userInclude = new List<Expression<Func<Domain.Entites.Identity.AppUser, object>>>
        {
            x => x.Company
        };
        
        var user = await userRepo.FirstAsync(filters: u => u.Id == command.UserId, includes: userInclude);
        if(user == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | User with id : {command.UserId} not found");
            ThrowError($"User with id : {command.UserId} not found", 404);
        }
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var efficiencyPolicyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            c => c.Registers,
            c => c.EfficiencyPoliciesApplyed
        };
        
        var company = await companyRepository.FirstAsync(includes: include, filters: c => c.Id == command.CompanyId);
        if (company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with Id {command.CompanyId} not found");
            ThrowError($"Company with Id {command.CompanyId} not found", 404);
        }

        var policy = await efficiencyPolicyRepository.GetByIdAsync(command.PolicyId , useInactive: true);
        if (policy == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Efficiency Policy with Id {command.PolicyId} not found");
            ThrowError($"Efficiency Policy with Id {command.PolicyId} not found", 404);
        }

        var appliedPolicy = company.EfficiencyPoliciesApplyed.FirstOrDefault(x => x.EfficiencyPolicyId == command.PolicyId && x.ApplyingDate.Date == command.ApplyingDate.Date);
        if(appliedPolicy is null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Efficiency Policy with Id {command.PolicyId} not applied to Company with Id {command.CompanyId} on given date");
            ThrowError($"Efficiency Policy with Id {command.PolicyId} not applied to Company with Id {command.CompanyId} on given date", 404);
        }

        var start = appliedPolicy.ApplyingDate.Date;
        var end = appliedPolicy.To?.Date ?? DateTime.UtcNow.Date;     // in case the policy is currently active we use the current date as end date
    
        TimeSpan timeSpan = end - start ;
        DateTime startBeforePeriod = start - timeSpan;

        var registersBefore = company.Registers.Where(r => r.Date.Date >= startBeforePeriod && r.Date.Date < start && r.StatusBaseEntity == Domain.Enums.StatusEntityType.Active)
            .OrderByDescending(r => r.Date)
            .ToList();

        var registersAfter = company.Registers.Where(r => r.Date.Date <= end && r.Date.Date >= start && r.StatusBaseEntity == Domain.Enums.StatusEntityType.Active)
            .OrderByDescending(r => r.Date)
            .ToList();
        
        var html = _templateService.GetPolicyComparisonTemplate(user, policy, registersBefore, registersAfter, company.Name);
        if(!_pluginLoader.TryGetExporter(command.Format, out var exporter))
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Exporter for format: {command.Format} is not implemented");
            ThrowError($" Exporter for format: {command.Format} is not implemented", 404);
        }
        var pdf = exporter!.Export(html);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return pdf;
    }
}