using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Plugins;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Office.Query.Export.List;
public class ExportOfficesByCompanyCommandHandler : CoreQueryHandler<ExportOfficesByCompanyCommand, byte[]>
{
    readonly ILogger<ExportOfficesByCompanyCommandHandler> _logger;
    readonly ITemplateService _templateService;
    readonly PluginLoader _pluginLoader;
    public ExportOfficesByCompanyCommandHandler(
        ILogger<ExportOfficesByCompanyCommandHandler> logger, 
        ITemplateService templateService,   
        PluginLoader pluginLoader,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
        _pluginLoader = pluginLoader;
    }

    public override async Task<byte[]> ExecuteAsync(ExportOfficesByCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepo = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();

        var userInclude = new List<Expression<Func<Domain.Entites.Identity.AppUser, object>>>
        {
            x => x.Company
        };
        var companyRepo = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();

        var user = await userRepo.FirstAsync(filters: u => u.Id == command.UserId, includes: userInclude);
        if(user == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | User with id : {command.UserId} not found");
            ThrowError($"User with id : {command.UserId} not found", 404);
        }
        var company = await companyRepo.FirstAsync(filters: c => c.Id == command.CompanyId);
        if(company == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Company with id : {command.CompanyId} not found");

            ThrowError($" Company with id : {command.CompanyId} not found", 404);
        }
        var officeRepo = UnitOfWork!.DbRepository<Domain.Entites.Offices.Office>();
        var offices = await officeRepo.GetAll(useInactive: false, filters: o => o.CompanyId == command.CompanyId).ToListAsync(ct);
        
        var html = _templateService.GetOfficesTemplate(user, offices, company.Name);
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