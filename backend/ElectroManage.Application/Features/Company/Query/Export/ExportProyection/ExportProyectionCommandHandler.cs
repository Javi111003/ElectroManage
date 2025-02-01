using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Query.Export.Proyection;
public class ExportProyectionCommandHandler : CoreQueryHandler<ExportProyectionCommand, byte[]>
{
    readonly ILogger<ExportProyectionCommandHandler> _logger;
    readonly ITemplateService _templateService;
    public ExportProyectionCommandHandler(
        ILogger<ExportProyectionCommandHandler> logger, 
        ITemplateService templateService, 
        IExporter exporter,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override Task<byte[]> ExecuteAsync(ExportProyectionCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        throw new NotImplementedException();
    }
}