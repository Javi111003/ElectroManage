using ElectroManage.Domain.DataAccess;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Plugins;
using ElectroManage.Infraestructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.Export.ListCompanyOverLimit;
public class ExportListCompanyOverLimitCommandHandler : CoreQueryHandler<ExportListCompanyOverLimitCommand, byte[]>
{
    readonly ILogger<ExportListCompanyOverLimitCommandHandler> _logger;
    readonly ITemplateService _templateService;
    readonly PluginLoader _pluginLoader;
    public ExportListCompanyOverLimitCommandHandler(
        ILogger<ExportListCompanyOverLimitCommandHandler> logger, 
        ITemplateService templateService, 
        PluginLoader pluginLoader,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _pluginLoader = pluginLoader;
        _logger = logger;
        _templateService = templateService;
    }
    public override async Task<byte[]> ExecuteAsync(ExportListCompanyOverLimitCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepo = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();
        var userInclude = new List<Expression<Func<Domain.Entites.Identity.AppUser, object>>>
        {
            x => x.Company
        };
        var user = await userRepo.FirstAsync(filters: u => u.Id == command.UserId, includes: userInclude);
        if (user == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | User with id : {command.UserId} not found");
            ThrowError($"User with id : {command.UserId} not found", 404);
        }
        var warningRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Warning>();
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Warning, object>>>
        {
            w => w.Company
        };
        var filter = new Expression<Func<Domain.Entites.Sucursal.Warning, bool>>[]
        {
            w => w.Created.Month == command.Date.Month && w.Created.Year == command.Date.Year,
        };
        var warnings = await warningRepository.GetAll(useInactive: true, includes: include, filters: filter)
        .ToListAsync(ct);

        var groupedWarnings = warnings.GroupBy(w => w.CompanyId);
        var html = _templateService.GetExcessTemplate(user, groupedWarnings, command.Date);
        if (!_pluginLoader.TryGetExporter(command.Format, out var exporter))
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Exporter for format: {command.Format} is not implemented");
            ThrowError($" Exporter for format: {command.Format} is not implemented", 404);
        }
        var doc = exporter!.Export(html);
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        return doc;
    }
}