using ElectroManage.Domain.DataAccess.Abstractions;
using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;

namespace ElectroManage.Application.Features.AppUser.Query.Export.List;
public class ExportListAppUsersCommandHandler : CoreQueryHandler<ExportListAppUsersCommand, byte[]>
{
    readonly ILogger<ExportListAppUsersCommandHandler> _logger;
    readonly ITemplateService _templateService;
    public ExportListAppUsersCommandHandler(
        ILogger<ExportListAppUsersCommandHandler> logger, 
        ITemplateService templateService, 
        IExporter exporter,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _logger = logger;
        _templateService = templateService;
    }
    public override Task<byte[]> ExecuteAsync(ExportListAppUsersCommand command, CancellationToken ct = default)
    {
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution started");
        _logger.LogInformation($"{nameof(ExecuteAsync)} | Execution completed");
        throw new NotImplementedException();
    }
}