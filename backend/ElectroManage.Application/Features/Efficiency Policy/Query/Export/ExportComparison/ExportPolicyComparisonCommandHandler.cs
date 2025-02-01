using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Export.Comparison;
public class ExportPolicyComparisonCommandHandler : CoreQueryHandler<ExportPolicyComparisonCommand, byte[]>
{
    readonly ILogger<ExportPolicyComparisonCommandHandler> _logger;
    readonly ITemplateService _templateService;
    public ExportPolicyComparisonCommandHandler(
        ILogger<ExportPolicyComparisonCommandHandler> logger, 
        ITemplateService templateService, 
        IExporter exporter,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override Task<byte[]> ExecuteAsync(ExportPolicyComparisonCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        throw new NotImplementedException();
    }
}