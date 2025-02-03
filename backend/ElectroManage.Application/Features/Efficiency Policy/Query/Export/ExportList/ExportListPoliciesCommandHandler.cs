using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Plugins;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Export.List;
public class ExportListPoliciesCommandHandler : CoreQueryHandler<ExportListPoliciesCommand, byte[]>
{
    readonly ILogger<ExportListPoliciesCommandHandler> _logger;
    readonly ITemplateService _templateService;
    readonly PluginLoader _pluginLoader;
    public ExportListPoliciesCommandHandler(
        ILogger<ExportListPoliciesCommandHandler> logger, 
        ITemplateService templateService, 
        PluginLoader pluginLoader,
        IUnitOfWork unitOfWork) : base(unitOfWork)

    {
        _logger = logger;
        _templateService = templateService;
        _pluginLoader = pluginLoader;
    }
    public override async Task<byte[]> ExecuteAsync(ExportListPoliciesCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepo = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();
        var userInclude = new List<Expression<Func<Domain.Entites.Identity.AppUser, object>>>
        {
            x => x.Company
        };
        var policyRepo = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.EfficiencyPolicy>();
        
        var user = await userRepo.FirstAsync(filters: u => u.Id == command.UserId, includes: userInclude);
        if(user == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | User with id : {command.UserId} not found");
            ThrowError($"User with id : {command.UserId} not found", 404);
        }
        var policies = await policyRepo.GetAll(useInactive: false).ToListAsync(ct);
        var html = _templateService.GetPoliciesTemplate(user, policies);
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