using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.Company.Query.Export.ListCompanyOverLimit;
public class ExportListCompanyOverLimitCommandHandler : CoreQueryHandler<ExportListCompanyOverLimitCommand, byte[]>
{
    readonly ILogger<ExportListCompanyOverLimitCommandHandler> _logger;
    readonly ITemplateService _templateService;
    public ExportListCompanyOverLimitCommandHandler(
        ILogger<ExportListCompanyOverLimitCommandHandler> logger, 
        ITemplateService templateService, 
        IExporter exporter,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override Task<byte[]> ExecuteAsync(ExportListCompanyOverLimitCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        throw new NotImplementedException();
    }
}