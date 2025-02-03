using ElectroManage.Application.Abstractions;
using ElectroManage.Application.Features.Company.Query.ProyectionNextThreeMonth;
using ElectroManage.Domain.DataAccess;
using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Plugins;
using ElectroManage.Infraestructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using static ElectroManage.Infraestructure.Concrete.TemplateService;

namespace ElectroManage.Application.Features.Company.Query.Export.Proyection;
public class ExportProyectionCommandHandler : CoreQueryHandler<ExportProyectionCommand, byte[]>
{
    readonly ILogger<ExportProyectionCommandHandler> _logger;
    readonly ITemplateService _templateService;
    readonly PluginLoader _pluginLoader;
    readonly IProyectionService _proyectionService;
    public ExportProyectionCommandHandler(
        ILogger<ExportProyectionCommandHandler> logger, 
        ITemplateService templateService, 
        PluginLoader pluginLoader,
        IProyectionService proyectionService,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _pluginLoader = pluginLoader;
        _templateService = templateService;
        _proyectionService = proyectionService;
        _logger = logger;
    }
    public override async Task<byte[]> ExecuteAsync(ExportProyectionCommand command, CancellationToken ct = default)
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
        var include = new List<Expression<Func<Domain.Entites.Sucursal.Company, object>>>
        {
            c => c.Registers
        };
        var companies = await companyRepository.GetAllListOnly(includes: include, filters: x => command.CompaniesId.Contains(x.Id))
            .ToListAsync();
        var notFound = command.CompaniesId.Except(companies.Select(x => x.Id));
        foreach (var id in notFound)
        {
            _logger.LogInformation($"Company with id: {id} not found");
            AddError(message: $"Company with id: {id} not found");
        }
        ThrowIfAnyErrors(404);
        var companyPredictions = new List<CompanyWithProyections>();
        foreach (var company in companies)
        {
            if (company.Registers.Count > 0)
            {
                companyPredictions.Add(new CompanyWithProyections
                {
                    CompanyId = company.Id,
                    Proyections = _proyectionService.CalculateProyectionsAsync(company).Select(x => new ProyectionInfo
                    {
                         Month = x.Month,
                         FutureConsumption = x.FutureConsumption
                    })
                });
            }
            else
            {
                companyPredictions.Add(new CompanyWithProyections
                {
                    CompanyId = company.Id,
                    CompanyName = company.Name,
                    Proyections = []
                });
            }
        }
        var html = _templateService.GetPredictionTemplate(user, companyPredictions);
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