using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Register.Query.Export.List;
public class ExportRegistersByCompanyCommandHandler : CoreQueryHandler<ExportRegistersByCompanyCommand, byte[]>
{
    readonly ILogger<ExportRegistersByCompanyCommandHandler> _logger;
    readonly ITemplateService _templateService;
    public ExportRegistersByCompanyCommandHandler(
        ILogger<ExportRegistersByCompanyCommandHandler> logger, 
        ITemplateService templateService, 
        IExporter exporter,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override Task<byte[]> ExecuteAsync(ExportRegistersByCompanyCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        throw new NotImplementedException();
    }
}