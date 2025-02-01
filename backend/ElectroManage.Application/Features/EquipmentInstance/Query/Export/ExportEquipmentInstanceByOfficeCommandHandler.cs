using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.EquipmentInstance.Query.Export.List;
public class ExportEquipmentInstancesByOfficeCommandHandler : CoreQueryHandler<ExportEquipmentInstancesByOfficeCommand, byte[]>
{
    readonly ILogger<ExportEquipmentInstancesByOfficeCommandHandler> _logger;
    readonly ITemplateService _templateService;
    public ExportEquipmentInstancesByOfficeCommandHandler(
        ILogger<ExportEquipmentInstancesByOfficeCommandHandler> logger, 
        ITemplateService templateService, 
        IExporter exporter,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override Task<byte[]> ExecuteAsync(ExportEquipmentInstancesByOfficeCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        throw new NotImplementedException();
    }
}