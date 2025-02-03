using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Plugins;
using ElectroManage.Infraestructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.Company.Query.Export.MeanCost;
public class ExportMeanCostCommandHandler : CoreQueryHandler<ExportMeanCostCommand, byte[]>
{
    readonly ILogger<ExportMeanCostCommandHandler> _logger;
    readonly ITemplateService _templateService;
    readonly PluginLoader _pluginLoader;
    public ExportMeanCostCommandHandler(
        ILogger<ExportMeanCostCommandHandler> logger, 
        ITemplateService templateService, 
        PluginLoader pluginLoader,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _pluginLoader = pluginLoader;
        _logger = logger;
        _templateService = templateService;
    }
    public override async Task<byte[]> ExecuteAsync(ExportMeanCostCommand command, CancellationToken ct = default)
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
        var companyRepository = UnitOfWork!.DbRepository<Domain.Entites.Sucursal.Company>();
        var companyInclude = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            x => x.Registers
        };
        var companies = await companyRepository.GetAllListOnly(useInactive: true, includes: companyInclude, filters: x => command.CompanyIds.Contains(x.Id))
            .ToListAsync();
        var notFound = command.CompanyIds.Except(companies.Select(x => x.Id));
        foreach (var id in notFound)
        {
            _logger.LogInformation($"Company with id: {id} not found");
            AddError(message: $"Company with id: {id} not found");
        }
        ThrowIfAnyErrors(404);
        var html = _templateService.GetAvgConsumptionTemplate(user, companies);
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