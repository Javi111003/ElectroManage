using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Plugins;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Warning.Query.Export.List;
public class ExportWarningsByCompanyCommandHandler : CoreQueryHandler<ExportWarningsByCompanyCommand, byte[]>
{
    readonly ILogger<ExportWarningsByCompanyCommandHandler> _logger;
    readonly ITemplateService _templateService;
    readonly PluginLoader _pluginLoader;
    public ExportWarningsByCompanyCommandHandler(
        ILogger<ExportWarningsByCompanyCommandHandler> logger, 
        ITemplateService templateService, 
        PluginLoader pluginLoader,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _pluginLoader = pluginLoader;
        _logger = logger;
        _templateService = templateService;
    }
    public override async Task<byte[]> ExecuteAsync(ExportWarningsByCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepo = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();
        var userInclude = new List<Expression<Func<Domain.Entites.Identity.AppUser, object>>>
        {
            x => x.Company
        };
        var companyRepo = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var companyInclude = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Warnings
        };
        var user = await userRepo.FirstAsync(filters: u => u.Id == command.UserId, includes: userInclude);
        if(user == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | User with id : {command.UserId} not found");
            ThrowError($"User with id : {command.UserId} not found", 404);
        }
        var company = await companyRepo.FirstAsync(filters: c => c.Id == command.CompanyId, includes: companyInclude);
        if(company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id : {command.CompanyId} not found");
            ThrowError($" Company with id : {command.CompanyId} not found", 404);
        }
        var html = _templateService.GetAlertsTemplate(user, company);
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