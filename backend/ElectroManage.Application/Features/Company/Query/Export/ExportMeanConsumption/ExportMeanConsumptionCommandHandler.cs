using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Query.Export.MeanCost;
public class ExportMeanCostCommandHandler : CoreQueryHandler<ExportMeanCostCommand, byte[]>
{
    readonly ILogger<ExportMeanCostCommandHandler> _logger;
    readonly ITemplateService _templateService;
    public ExportMeanCostCommandHandler(
        ILogger<ExportMeanCostCommandHandler> logger, 
        ITemplateService templateService, 
        IExporter exporter,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override Task<byte[]> ExecuteAsync(ExportMeanCostCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        throw new NotImplementedException();
    }
}