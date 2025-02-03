using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Plugins;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace ElectroManage.Application.Features.EquipmentInstance.Query.Export.List;
public class ExportEquipmentInstancesByOfficeCommandHandler : CoreQueryHandler<ExportEquipmentInstancesByOfficeCommand, byte[]>
{
    readonly ILogger<ExportEquipmentInstancesByOfficeCommandHandler> _logger;
    readonly ITemplateService _templateService;
    readonly PluginLoader _pluginLoader;
    public ExportEquipmentInstancesByOfficeCommandHandler(
        ILogger<ExportEquipmentInstancesByOfficeCommandHandler> logger, 
        ITemplateService templateService, 
        PluginLoader pluginLoader,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
        _pluginLoader = pluginLoader;
    }

    public override async Task<byte[]> ExecuteAsync(ExportEquipmentInstancesByOfficeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        var userRepo = UnitOfWork!.DbRepository<Domain.Entites.Identity.AppUser>();

        var userInclude = new List<Expression<Func<Domain.Entites.Identity.AppUser, object>>>
        {
            x => x.Company
        };
        var officeRepo = UnitOfWork!.DbRepository<Domain.Entites.Offices.Office>();
        var officeInclude = new List<Expression<Func<Domain.Entites.Offices.Office, object>>>
        {
            x => x.Company
        };

        var user = await userRepo.FirstAsync(filters: u => u.Id == command.UserId, includes: userInclude);
        if(user == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | User with id : {command.UserId} not found");
            ThrowError($"User with id : {command.UserId} not found", 404);
        }
        var office = await officeRepo.FirstAsync(filters: o => o.Id == command.OfficeId, includes: officeInclude);
        if(office == null)
        {
            _logger.LogError($"{nameof(ExecuteAsync)} | Office with id : {command.OfficeId} not found");
            ThrowError($" Office with id : {command.OfficeId} not found", 404);
        }
        var equipmentInstanceRepo = UnitOfWork!.DbRepository<Domain.Entites.Equipment.EquipmentInstance>();
        var equipments = await equipmentInstanceRepo.GetAllListOnly(filters: e => e.OfficeId == command.OfficeId)
                .Include(x => x.Office)
                    .ThenInclude(x => x.Company)
                .Include(x => x.EquipmentSpecification)
                    .ThenInclude(x => x.EquipmentBrand)
                .Include(x => x.EquipmentSpecification)
                    .ThenInclude(x => x.EquipmentType)
                .ToListAsync();

        var html = _templateService.GetEquipmentsTemplate(user, equipments, office.Company.Name, office.Name);
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