using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Efficiency_Policy.Query.Export.List;
public class ExportPoliciesByCompanyCommandHandler : CoreQueryHandler<ExportPoliciesByCompanyCommand, byte[]>
{
    readonly ILogger<ExportPoliciesByCompanyCommandHandler> _logger;
    readonly ITemplateService _templateService;
    public ExportPoliciesByCompanyCommandHandler(
        ILogger<ExportPoliciesByCompanyCommandHandler> logger, 
        ITemplateService templateService, 
        IExporter exporter,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override Task<byte[]> ExecuteAsync(ExportPoliciesByCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        throw new NotImplementedException();
    }
}