using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Plugins;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.Export.List;
public class ExportListCompanyCommandHandler : CoreQueryHandler<ExportListCompanyCommand, byte[]>
{
    readonly ILogger<ExportListCompanyCommandHandler> _logger;
    readonly ITemplateService _templateService;
    readonly PluginLoader _pluginLoader;
    public ExportListCompanyCommandHandler(
        ILogger<ExportListCompanyCommandHandler> logger, 
        ITemplateService templateService, 
        PluginLoader pluginLoader,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override async Task<byte[]> ExecuteAsync(ExportListCompanyCommand command, CancellationToken ct = default)
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
            x => x.AdministrativeArea,
            x => x.InstalationType,
            x => x.Location
        };
        var user = await userRepo.FirstAsync(filters: u => u.Id == command.UserId, includes: userInclude);
        if(user == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | User with id : {command.UserId} not found");
            ThrowError($"User with id : {command.UserId} not found", 404);
        }
        var companies = await companyRepo.GetAll(useInactive: false, includes: companyInclude).ToListAsync(ct);
        var html = _templateService.GetCompaniesTemplate(user, companies);
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