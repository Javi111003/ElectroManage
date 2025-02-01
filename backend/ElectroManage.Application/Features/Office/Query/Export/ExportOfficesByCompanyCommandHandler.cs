using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Office.Query.Export.List;
public class ExportOfficesByCompanyCommandHandler : CoreQueryHandler<ExportOfficesByCompanyCommand, byte[]>
{
    readonly ILogger<ExportOfficesByCompanyCommandHandler> _logger;
    readonly ITemplateService _templateService;
    public ExportOfficesByCompanyCommandHandler(
        ILogger<ExportOfficesByCompanyCommandHandler> logger, 
        ITemplateService templateService, 
        IExporter exporter,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override Task<byte[]> ExecuteAsync(ExportOfficesByCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        throw new NotImplementedException();
    }
}