using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Warning.Query.Export.List;
public class ExportWarningsByCompanyCommandHandler : CoreQueryHandler<ExportWarningsByCompanyCommand, byte[]>
{
    readonly ILogger<ExportWarningsByCompanyCommandHandler> _logger;
    readonly ITemplateService _templateService;
    public ExportWarningsByCompanyCommandHandler(
        ILogger<ExportWarningsByCompanyCommandHandler> logger, 
        ITemplateService templateService, 
        IExporter exporter,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override Task<byte[]> ExecuteAsync(ExportWarningsByCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        throw new NotImplementedException();
    }
}